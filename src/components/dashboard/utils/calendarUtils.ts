import { DocumentData } from "firebase/firestore";
import { Priority, PriorityColor, TCalendarEvent } from "../../types";

export const convertEventsToBeScheduled = (tasks: Array<TCalendarEvent>) => {
	const convertedTasks: Array<TCalendarEvent> = tasks.map((task: DocumentData) => {
			return {
				...task,
				start: task?.start.toDate(),
				end: task?.end.toDate(),
			} as TCalendarEvent;
		}
	);

	return convertedTasks;
};

export const getEventsToBeScheduled = (tasks: Array<DocumentData>) => {
	const scheduledTasks: Array<TCalendarEvent> = tasks.reduce((tasksAcc: Array<TCalendarEvent>, task: DocumentData) => {
		if (task.isScheduled && !task.completed && task.startDate && task.endDate) {
			const scheduledTask = {
				event_id: task.id,
				title: task.name,
				start: task.startDate.toDate(),
				end: task.endDate.toDate(),
				color: PriorityColor[task.priority as Priority] || PriorityColor[Priority.notSet],
				editable: true,
			};
			tasksAcc.push(scheduledTask);
		}
		return tasksAcc;
	}, []);

	return scheduledTasks;
};

export function getTasksSchedule(tasks: Array<DocumentData>) {
	console.log(tasks)
	const schedule = [];
	let currentDateTime = new Date();
	currentDateTime.setHours(8, 0, 0, 0); // Start from 8:00 AM

	tasks.sort((a: DocumentData, b: DocumentData) => a.startDate - b.startDate); // Sort tasks by start date

	for (const task of tasks) {
	  let taskStartDateTime = task.startDate.toDate();
	  let taskEndDateTime = task.endDate.toDate();

	  if (!task.isDaySpecific) {
		// For tasks that are not day-specific, extract hours and minutes from start and end dates
		taskStartDateTime = new Date(currentDateTime);
		taskStartDateTime.setHours(task.startDate.toDate().getHours(), task.startDate.toDate().getMinutes());

		taskEndDateTime = new Date(currentDateTime);
		taskEndDateTime.setHours(task.endDate.toDate().getHours(), task.endDate.toDate().getMinutes());
	  }

	  if (taskStartDateTime > taskEndDateTime) {
		// Skip tasks with invalid date ranges
		continue;
	  }

	  if (taskStartDateTime < currentDateTime) {
		// Move the task to the next day if it starts before the current time
		taskStartDateTime.setDate(taskStartDateTime.getDate() + 1);
		taskEndDateTime.setDate(taskEndDateTime.getDate() + 1);
	  }

	//   if (taskStartDateTime > currentDateTime) {
	// 	// If there's a gap between the current time and the task start time, add a gap event
	// 	schedule.push({
	// 	  event_id: `gap-${currentDateTime.getTime()}`,
	// 	  title: 'Gap',
	// 	  startDate: currentDateTime,
	// 	  endDate: taskStartDateTime,
	// 	});
	//   }

	  schedule.push({
		event_id: task.id,
		title: task.name,
		start: taskStartDateTime,
		end: taskEndDateTime,
		color: PriorityColor[task.priority as Priority] || PriorityColor[Priority.notSet],
	  });

	  currentDateTime = taskEndDateTime;
	  if (currentDateTime.getHours() >= 18) {
		// If the current time exceeds 18:00, move to the next day at 8:00 AM
		currentDateTime.setDate(currentDateTime.getDate() + 1);
		currentDateTime.setHours(8, 0, 0, 0);
	  }
	}

	return schedule;
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
