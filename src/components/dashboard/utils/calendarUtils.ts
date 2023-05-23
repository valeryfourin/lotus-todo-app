import { DocumentData } from "firebase/firestore";
import { Priority, PriorityColor, TCalendarEvent } from "../../types";

const oneMinuteInSeconds = 60;
const oneHourInMinutes = 60;
const oneSecondInMilliseconds = 1000;
const defaultEstimateInHours = 1;
const defaultIntervalInMilliseconds =
    30 * oneMinuteInSeconds * oneSecondInMilliseconds;
const maxNumberOfDaysToSchedule = 30;

// Important note: if the task is DocumentData, it means it comes from the database and it`s properties are of type Timestamp, convert them to Date before using them

export function convertEventsToBeScheduled (tasks: Array<TCalendarEvent>): Array<TCalendarEvent> {
	const convertedTasks: Array<TCalendarEvent> = tasks.map((task: DocumentData) => {
			return {
				...task,
				start: task?.start.toDate() || null,
				end: task?.end.toDate() || null,
				deadline: task?.deadline?.toDate() || null,
			} as TCalendarEvent;
		}
	);

	return convertedTasks;
};

export function getEventsWithStartAndEndDateToBeScheduled (tasks: Array<DocumentData>): Array<TCalendarEvent> {
	const scheduledTasks: Array<TCalendarEvent> = tasks.reduce((tasksAcc: Array<TCalendarEvent>, task: DocumentData) => {
		if (task.isScheduled && !task.completed && task.isDaySpecific && task.startDate && task.endDate) {
			const scheduledTask = {
				event_id: task.id,
				title: task.name,
				start: task.startDate.toDate(),
				end: task.endDate.toDate(),
				color: PriorityColor[task.priority as Priority] || PriorityColor[Priority.notSet],
				editable: true,
				description: task.description,
				priority: task.priority,
				estimate: task.estimate,
				deadline: task.deadline?.toDate() || null,
			};

			if (scheduledTask.deadline && scheduledTask.deadline < new Date()) {
				// if the task has past the deadline set it`s priority to critical and add a note to the description
				scheduledTask.priority = Priority.critical;
				scheduledTask.color = PriorityColor[Priority.critical];
				scheduledTask.description = `${scheduledTask.description ?? ''} (Deadline passed)`;
			}

			tasksAcc.push(scheduledTask);
		}
		return tasksAcc;
	}, []);

	return scheduledTasks;
};

export function generateSchedule(
	tasks: Array<DocumentData>,
	workingHoursStart: Date,
	workingHoursEnd: Date,
	interval = defaultIntervalInMilliseconds
): Array<TCalendarEvent> {
	const scheduledTasks = getEventsWithStartAndEndDateToBeScheduled(tasks); // schedule tasks that already have start and end dates set
	const scheduledTasksIds = scheduledTasks.map((task: TCalendarEvent) => task.event_id);
	const tasksToBeScheduled = tasks.filter((task: DocumentData) => !scheduledTasksIds.includes(task.id) && task.isScheduled && !task.completed);

	const finalSchedule: TCalendarEvent[] = [...scheduledTasks];

	let currentScheduleTime = workingHoursStart; // start scheduling from working day start time
	currentScheduleTime.setDate(workingHoursStart.getDate() + 1); // start scheduling from the beginning of the next day

	tasksToBeScheduled.sort(compareByStartHours); // sort tasks by start hour

	for (const task of tasksToBeScheduled) {
		if (!task.isDaySpecific && task.isScheduled) {
			let taskStartDateTime = task.startDate?.toDate();
			let taskEndDateTime = task.endDate?.toDate();
			const taskDeadline = task.deadline?.toDate() || null;

			let scheduledTask = {
				event_id: task.id,
				title: task.name,
				description: task.description,
				priority: task.priority,
				estimate: task?.estimate || defaultEstimateInHours,
				start: taskStartDateTime,
				end: taskEndDateTime,
				deadline: taskDeadline,
				color: PriorityColor[task.priority as Priority] || PriorityColor[Priority.notSet],
				editable: true,
			};

			if (taskDeadline && taskDeadline < new Date()) {
				// if the task has past the deadline set it`s priority to critical and add a note to the description
				scheduledTask.priority = Priority.critical;
				scheduledTask.color = PriorityColor[Priority.critical];
				scheduledTask.description = `${scheduledTask.description ?? ''} (Deadline passed)`;
			}
            // schedule event without clashing other scheduled events
            const newScheduledTask = findTimeSlotForEvent(
                finalSchedule,
                workingHoursStart,
                workingHoursEnd,
                interval,
                scheduledTask
            );

            if (newScheduledTask) {
                finalSchedule.push(newScheduledTask);
            }
        }
	}

	return finalSchedule;
}

function findTimeSlotForEvent (
    scheduledTasks: Array<TCalendarEvent>,
    workingHoursStart: Date,
    workingHoursEnd: Date,
    intervalInMs: number,
    newTask: TCalendarEvent
) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1); // Start from the following day
    let maxLoopCount = maxNumberOfDaysToSchedule; // Maximum number of days to loop through (safety precaution)
    const taskDuration = getTaskDurationInMilliseconds(newTask);
	const hasTaskFixedTime = Boolean(newTask?.start || newTask?.end);
	let scheduledTasksOnThisDate: Array<TCalendarEvent> = [];

    while (maxLoopCount > 0) {
        let { startTime, endTime } = evaluateTaskStartAndEndTime(
            newTask,
            nextDay,
            workingHoursStart
        );
		let hasEventConflict = false;
		// Optimize but looping through tasks that are scheduled on the day that we are currently on in this while loop
		scheduledTasksOnThisDate = scheduledTasks.filter((task: TCalendarEvent) => areDatesTheSameDay(task.start, nextDay));

		for (let index = 0; index < scheduledTasksOnThisDate.length; index++) {
			const task = scheduledTasksOnThisDate[index];
			hasEventConflict = endTime > task.start && startTime < task.end;

			if (!hasTaskFixedTime && hasEventConflict) {
				// Adjust the start time to the end time of the conflicting task plus the interval
				startTime = new Date(task.end.getTime() + intervalInMs);
				endTime = new Date(startTime.getTime() + taskDuration); // Adjust the end time accordingly
			} else if (hasTaskFixedTime && hasEventConflict) {
				// If the task has fixed time and there is a conflict on this day, skip to the next day
				break;
			}
		}

		// When the loop if finished, check if there are any conflicts with already scheduled tasks for second optimization
		// as there might be some cases with overlapping afterwards
		if (!hasTaskFixedTime && hasEventConflicts(scheduledTasksOnThisDate, {start: startTime, end: endTime})) {
			// Adjust the start time to the end time of the last event of the day plus the interval
			scheduledTasksOnThisDate.sort(compareByStartHours);
			startTime = new Date(scheduledTasksOnThisDate[scheduledTasksOnThisDate.length - 1].end.getTime() + intervalInMs);
			endTime = new Date(startTime.getTime() + taskDuration); // Adjust the end time accordingly

			hasEventConflict = false;
		}

        // Check if the scheduled time slot falls within the working hours of the current day
        if (
			!hasEventConflict &&
            startTime.getHours() >= workingHoursStart.getHours() &&
            endTime.getHours() <= workingHoursEnd.getHours()
        ) {
            newTask.start = startTime;
            newTask.end = endTime;

            return newTask; // Found a suitable time slot, return the task
        }

        // Move to the following day after next day
        nextDay.setDate(nextDay.getDate() + 1);
        maxLoopCount--;
    }

    // No suitable time slot found within the specified number of days
    console.log(
        `Unable to find a suitable time slot for the task "${newTask.title}" with id ${newTask.event_id} within the specified days.`
    );
    return null;
};

function evaluateTaskStartAndEndTime (task: TCalendarEvent, day: Date, workingHoursStart: Date) {
    const taskDuration = getTaskDurationInMilliseconds(task);
    let startTime, endTime;
    if (!task.start && !task.end) {
        startTime = new Date(day);
        startTime.setHours(workingHoursStart.getHours(), 0, 0, 0);
        endTime = new Date(startTime.getTime() + taskDuration);
    } else if (!task.start && task.end) {
        endTime = new Date(day);
        endTime.setHours(task.end.getHours(), task.end.getMinutes(), 0, 0);
        startTime = new Date(endTime.getTime() - taskDuration);
    } else {
        startTime = new Date(day);
        startTime.setHours(
            task.start.getHours() || workingHoursStart.getHours(),
            task.start.getMinutes() || 0,
            0,
            0
        );
        endTime = new Date(startTime.getTime() + taskDuration);
        endTime.setHours(
            task.end.getHours() || endTime.getHours(),
            task.end.getMinutes() || endTime.getMinutes(),
            0,
            0
        );
    }

    return { startTime, endTime };
};

function getTaskDurationInMilliseconds(task: TCalendarEvent): number {
    // Calculate the duration of the task in milliseconds based on the estimate or a default value
    return (
        task.estimate *
        oneHourInMinutes *
        oneMinuteInSeconds *
        oneSecondInMilliseconds
    );
}

// Custom comparator function to compare dates by starting hours
function compareByStartHours(date1: DocumentData, date2: DocumentData) {
	const hour1 = date1.startDate?.toDate()?.getHours() || date1.start?.getHours();
	const hour2 = date2.startDate?.toDate()?.getHours() || date2.start?.getHours();

	if (hour1 < hour2) {
		return -1;
	} else if (hour1 > hour2) {
		return 1;
	} else {
		return 0;
	}
};

function areDatesTheSameDay(date1: Date, date2: Date) {
	return date1.getFullYear() === date2.getFullYear() &&
	date1.getMonth() === date2.getMonth() &&
	date1.getDate() === date2.getDate();
}

function areEventsOverlapping(event1: Partial<TCalendarEvent>, event2: Partial<TCalendarEvent>) {
	if (!event1.start || !event1.end || !event2.start || !event2.end) {
		return;
	}

    return event1?.start < event2?.end && event2?.start < event1?.end;
}

function hasEventConflicts(events: TCalendarEvent[], eventToCheck: Partial<TCalendarEvent>) {
	return events.some((event) => areEventsOverlapping(event, eventToCheck));
}

export const EVENTS = [
	{
	  event_id: 1,
	  title: "Event 1",
	  start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
	  end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
	  disabled: true,
	},
	{
	  event_id: 2,
	  title: "Event 2",
	  start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
	  end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
	  color: "#50b500"
	},
	{
	  event_id: 3,
	  title: "Event 3",
	  start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
	  end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
	},
	{
	  event_id: 4,
	  title: "Event 4",
	  start: new Date(
		new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
		  new Date().getDate() - 2
		)
	  ),
	  end: new Date(
		new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
		  new Date().getDate() - 2
		)
	  ),
	  color: "#900000"
	},
	{
	  event_id: 5,
	  title: "Event 5",
	  start: new Date(
		new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
		  new Date().getDate() - 2
		)
	  ),
	  end: new Date(
		new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
		  new Date().getDate() - 2
		)
	  ),
	  editable: true
	},
	{
	  event_id: 6,
	  title: "Event 6",
	  start: new Date(
		new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
		  new Date().getDate() - 4
		)
	  ),
	  end: new Date(new Date(new Date().setHours(14)).setMinutes(0)),
	},
	{
		event_id: 5,
		title: "Event 5",
		start: new Date(
		  new Date(new Date(new Date().setHours(14)).setMinutes(30)).setDate(
			new Date().getDate() + 2
		  )
		),
		end: new Date(
			new Date(new Date(new Date().setHours(16))).setDate(
			  new Date().getDate() + 2
			)
		  ),
	  }
];
