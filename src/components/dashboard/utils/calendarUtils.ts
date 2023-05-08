import { DocumentData } from "firebase/firestore";
import { Priority, PriorityColor, TCalendarEvent } from "../../types";

export const getEventsToBeScheduled = (tasks: Array<DocumentData>) => {
	const scheduledTasks: Array<TCalendarEvent> = tasks.reduce((tasksAcc: Array<TCalendarEvent>, task: DocumentData) => {
		if (task.isScheduled && !task.completed && task.startDate && task.endDate) {
			const scheduledTask = {
				event_id: task.id,
				title: task.name,
				start: task.startDate.toDate(),
				end: task.endDate.toDate(),
				// editable: true,
				color: PriorityColor[task.priority as Priority]
			};
			tasksAcc.push(scheduledTask);
		}
		return tasksAcc;
	}, []);

	return scheduledTasks;
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
