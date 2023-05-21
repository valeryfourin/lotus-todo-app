import { DocumentData } from "firebase/firestore";
import { Priority, PriorityColor, TCalendarEvent } from "../../types";

const defaultIntervalInMinutes = 30;
const defaultEstimateInHours = 1;
const defaultMaxNumberOfTasksPerDay = 5;

export const convertEventsToBeScheduled = (tasks: Array<TCalendarEvent>): TCalendarEvent[] => {
	const convertedTasks: Array<TCalendarEvent> = tasks.map((task: DocumentData) => {
			return {
				...task,
				start: task?.start.toDate(),
				end: task?.end.toDate(),
				deadline: task?.deadline?.toDate(),
			} as TCalendarEvent;
		}
	);

	return convertedTasks;
};

export const getEventsToBeScheduled = (tasks: Array<DocumentData>) => {
	console.log(tasks)
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
				deadline: task.deadline?.toDate(),
			};

			if (scheduledTask.deadline && scheduledTask.deadline < new Date()) {
				// if the task has past the deadline set it`s priority to critical and add a note to the description
				scheduledTask.priority = Priority.critical;
				scheduledTask.color = PriorityColor[Priority.critical];
				scheduledTask.description = `${scheduledTask.description} (Deadline passed)`;
			}

			tasksAcc.push(scheduledTask);
		}
		return tasksAcc;
	}, []);
	console.log(scheduledTasks)
	return scheduledTasks;
};

export function getTasksSchedule(tasks: Array<DocumentData>, workingHoursStart: Date, workingHoursEnd: Date, interval = defaultIntervalInMinutes) {
	const schedule: TCalendarEvent[] = [];
	const scheduledTasks = getEventsToBeScheduled(tasks); // schedule tasks that already have start and end dates set
	const scheduledTasksIds = schedule.map((task: TCalendarEvent) => task.event_id);
	const tasksToBeScheduled = tasks.filter((task: DocumentData) => !scheduledTasksIds.includes(task.id) && task.isScheduled && !task.completed);
	let currentScheduleTime = workingHoursStart; // start scheduling from working day start time
	currentScheduleTime.setDate(workingHoursStart.getDate() + 1); // start scheduling from the beginning of the next day

	tasksToBeScheduled.sort(compareByStartHours); // sort tasks by start hour
	const tasksPerDay: Record<string, number> = {}; // keep track of the number of tasks scheduled for each day

	for (const task of tasksToBeScheduled) {
		let taskStartDateTime = task.startDate?.toDate();
		let taskEndDateTime = task.endDate?.toDate();
		const taskDeadline = task.deadline?.toDate();
		const taskDuration = taskDurationInMinutes(task);
		const scheduledTask = {
			event_id: task.id,
			title: task.name,
			description: task.description,
			priority: task.priority,
			start: taskStartDateTime,
			end: taskEndDateTime,
			deadline: taskDeadline,
			color: PriorityColor[task.priority as Priority] || PriorityColor[Priority.notSet],
			editable: true,
		};

		if (taskDeadline && taskDeadline < currentScheduleTime) {
			// if the task has past the deadline set it`s priority to critical and add a note to the description
			scheduledTask.priority = Priority.critical;
			scheduledTask.color = PriorityColor[Priority.critical];
			scheduledTask.description = `${scheduledTask.description} (Deadline passed)`;
		}

		if (!task.isDaySpecific) {
			if (schedule.length > 0) {
				const lastTask = schedule[schedule.length - 1];
				const lastTaskEndDateTime = lastTask.end;

				scheduledTask.start = addMinutes(lastTaskEndDateTime, interval);
				  scheduledTask.end = addMinutes(scheduledTask.start, taskDuration);
			}
			// For tasks that are not day-specific, extract hours and minutes from start and end dates
			taskStartDateTime = new Date(currentScheduleTime);
			taskStartDateTime.setHours(task.startDate.toDate().getHours(), task.startDate.toDate().getMinutes());

			taskEndDateTime = new Date(currentScheduleTime);
			taskEndDateTime.setHours(task.endDate.toDate().getHours(), task.endDate.toDate().getMinutes());
		}

		let taskDateString = scheduledTask.start.toDateString();
		tasksPerDay[taskDateString] = tasksPerDay[taskDateString] || 0; // Initialize the counter for the current day

		if (taskStartDateTime <= currentScheduleTime) {
			// Move the task to the next day if it starts before the current time
			taskStartDateTime.setDate(taskStartDateTime.getDate() + 1);
			taskEndDateTime.setDate(taskEndDateTime.getDate() + 1);

			const taskDateString = taskStartDateTime.toDateString();
			tasksPerDay[taskDateString]++;
		} else {
			currentScheduleTime = taskEndDateTime;
			tasksPerDay[taskDateString]++;

			// Check if the maximum number of tasks per day has been reached OR if the current time exceeds working day end
			if ((tasksPerDay[taskDateString] && tasksPerDay[taskDateString] >= defaultMaxNumberOfTasksPerDay) || currentScheduleTime.getHours() >= workingHoursEnd.getHours()) {
				// If so, move to the next day at working hour start
				currentScheduleTime.setDate(currentScheduleTime.getDate() + 1);
				currentScheduleTime.setHours(workingHoursStart.getHours(), 0, 0, 0);
			}
		}
		schedule.push(scheduledTask);
	}

	return [...schedule, ...scheduledTasks];
}

function addMinutes(date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * 60000);
}

function taskDurationInMinutes(task: DocumentData) {
	// Calculate the duration of the task in minutes based on the estimate or a default value
	return (task.estimate || defaultEstimateInHours) * 60;
}

// Custom comparator function to compare dates by hours
function compareByStartHours(date1: DocumentData, date2: DocumentData) {
	const hour1 = date1.startDate.getHours();
	const hour2 = date2.startDate.getHours();

	if (hour1 < hour2) {
		return -1;
	} else if (hour1 > hour2) {
		return 1;
	} else {
		return 0;
	}
};

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

function scheduleTasks(tasks: any, interval = 30) {
	const schedule = [];
	const sortedTasks = tasks.sort((a: any, b: any) => a.startDate - b.startDate); // Sort tasks by start date
	let currentDateTime = new Date(); // Start scheduling from the current time
	const tasksPerDay: any = {}; // Keep track of the number of tasks scheduled for each day

	for (const task of sortedTasks) {
	  if (task.startDate !== null || task.endDate !== null) {
		// Skip tasks that already have a start and end date
		schedule.push(task);
		continue;
	  }

	  const taskDeadline = task.deadline;
	  const taskDuration = taskDurationInMinutes(task);
	  const scheduledTask = { ...task };

	  if (taskDeadline && taskDeadline < scheduledTask.startDate) {
		// Skip tasks with a deadline that is already past
		continue;
	  }

	  if (schedule.length > 0) {
		const lastTask: any = schedule[schedule.length - 1];
		const lastTaskEndDateTime = lastTask.endDate;

		// Schedule the task with the minimum interval gap from the last task
		scheduledTask.startDate = addMinutes(lastTaskEndDateTime, interval);
		scheduledTask.endDate = addMinutes(scheduledTask.startDate, taskDuration);
	  } else {
		// Schedule the first task starting from the current time
		scheduledTask.startDate = currentDateTime;
		scheduledTask.endDate = addMinutes(currentDateTime, taskDuration);
	  }

	  // Check if the maximum number of tasks per day has been reached
	  const taskDate = scheduledTask.startDate.toDateString();
	  tasksPerDay[taskDate] = tasksPerDay[taskDate] || 0; // Initialize the counter for the current day
	  if (tasksPerDay[taskDate] >= 5) {
		continue; // Skip scheduling additional tasks for this day
	  }

	  tasksPerDay[taskDate]++; // Increment the counter for the current day
	  schedule.push(scheduledTask);
	}

	return schedule;
  }
