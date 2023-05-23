import { DocumentData } from "firebase/firestore";
import { dateOptions } from "../../../utils/constants";
import { Priority } from "../../types";

export const getNumberOfCompletedTasks = (tasks: DocumentData[]): number => {
	return tasks.filter((task) => task.completed).length;
}

export const getNumberOfUncompletedTasks = (tasks: DocumentData[]): number => {
	return tasks.filter((task) => !task.completed).length;
}

export const getNumberOfOverdueTasks = (tasks: DocumentData[]): number => {
	return tasks.filter((task) => task.deadline && !task.completed && task.deadline?.toDate()?.getTime() < new Date().getTime()).length;
}

export const getTotalNumberOfTasks = (tasks: DocumentData[]): number => {
	return tasks.length;
}

type TCompletedTasksWithDates = {
	numberOfTasksCompletedOverTime: number[];
	datesOfTasksCompletion: string[];
};
export const getNumberOfTasksCompletedOverTimeWithDates = (tasks: DocumentData[]): TCompletedTasksWithDates => {
	const numberOfTasksCompletedOverTime: Set<number> = new Set([]);
	const datesOfTasksCompletion: Set<string> = new Set([]);
	let numberOfTasksCompleted = 0;

	tasks.forEach((task) => {
		const dateWhenTaskCompleted = task.completeDate?.toDate().toLocaleDateString("en-US", dateOptions);
		if (task.completed && task.completeDate) {
			if (datesOfTasksCompletion.has(dateWhenTaskCompleted)) {
				numberOfTasksCompletedOverTime.delete(numberOfTasksCompleted);
			}
			numberOfTasksCompleted++;
			numberOfTasksCompletedOverTime.add(numberOfTasksCompleted);
			datesOfTasksCompletion.add(dateWhenTaskCompleted);
		}
	});

	return {
		numberOfTasksCompletedOverTime: Array.from(numberOfTasksCompletedOverTime),
		datesOfTasksCompletion: Array.from(datesOfTasksCompletion)
	};
}

export const getNumberOfTasksInEachColumnByPriority = (tasks: DocumentData[], columns: Record<string, DocumentData>, priority: Priority): number[] => {
	const numberOfTasksInEachColumn = Object.keys(columns).reduce((acc: any, columnId: string) => {
		acc[columnId] = 0;
		return acc;
	}, {});

	tasks.forEach((task) => {
		if (task.columnId && task.priority === priority) {
			numberOfTasksInEachColumn[task.columnId]++;
		}
	});

	return Object.values(numberOfTasksInEachColumn);
}
