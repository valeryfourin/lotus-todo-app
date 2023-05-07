import { DocumentData } from "firebase/firestore";
import { TaskCard } from "../grid/TaskCard";

interface IList {
	tasks: Array<DocumentData>
	columns: Record<string, DocumentData>
}

export const List = ({ tasks, columns }: IList): JSX.Element => {
	const tasksList = tasks?.map((task: DocumentData) => (
		<TaskCard
			key={ task.id }
			id={ task.id }
			columnId={ task.columnId }
			columnName={ columns[task.columnId][0]?.name }
			name={ task.name }
			description={ task.description }
			startDate={ task.deadline?.toDate() ?? null }
			endDate={ task.deadline?.toDate() ?? null }
			deadline={ task.deadline?.toDate() ?? null }
			priority={ task.priority }
			isDaySpecific={ task.isDaySpecific }
			completed={ task.completed }
			completeDate={ task.completeDate?.toDate() ?? null }
			isGridView={ false }
		/>)
	);

    return (
		<div className="list custom-scroll">
			{ tasksList	}
		</div>
	);
};
