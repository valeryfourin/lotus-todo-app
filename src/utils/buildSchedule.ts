import { TTask } from "../components/types";

export const buildSchedule = (tasks: Array<TTask>) => {
	// // Sort tasks by end time
	// const tasksWithStartDate = tasks.filter((task) => task.startDate && task.deadline);
	// tasksWithStartDate.sort((a, b) => a.startDate - b.startDate);

	// let lastEndTime = -Infinity;
	// const schedule = [];

	// for (let i = 0; i < tasks.length; i++) {
	//   const task = tasks[i];
	//   if (task.startDate >= lastEndTime) {
	// 	// Schedule task
	// 	schedule.push(task);
	// 	lastEndTime = task.deadline;
	//   }
	// }

	// return schedule;
}
