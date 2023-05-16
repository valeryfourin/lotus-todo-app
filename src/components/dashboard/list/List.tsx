import { DocumentData } from "firebase/firestore";
import { TaskCard } from "../../task/TaskCard";

interface IList {
	tasks: Array<DocumentData>
	columns: Record<string, DocumentData>
}

export const List = ({ tasks, columns }: IList): JSX.Element => {
	const tasksList = tasks?.map((taskData: DocumentData) => {
		const task = {
			id: taskData.id,
			columnId: taskData.columnId,
			columnName: columns[taskData.columnId][0]?.name,
			name: taskData.name,
			description: taskData.description,
			startDate: taskData.startDate?.toDate() ?? null,
			endDate: taskData.endDate?.toDate() ?? null,
			deadline: taskData.deadline?.toDate() ?? null,
			priority: taskData.priority,
			isDaySpecific: taskData.isDaySpecific,
			isScheduled: taskData.isScheduled,
			completed: taskData.completed,
			completeDate: taskData.completeDate?.toDate() ?? null,
		};

		return (
			<TaskCard
				key={ task.id }
				task={ task }
				isGridView={ false }
			/>)
	});

    return (
		<div className="list custom-scroll">
			{ tasksList	}
		</div>
	);
};
