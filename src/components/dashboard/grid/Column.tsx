import { DocumentData } from "firebase/firestore";
import { Box, Grid } from "@mui/material";
import { IColumnProps } from "../../types";
import { TaskCard } from "../../task/TaskCard";
import PopupIcon from "../../sidebar/PopupIcon";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectedProjectSelector } from "../../store";

const columnStyles = {
	width: '300px',
	backgroundColor: '#f9f9f9',
	padding: '10px',
	borderRadius: '10px',
};

const Column = ({ title, id, tasks }: IColumnProps) => {
    const selectedProject = useSelector(selectedProjectSelector);
    const [buttonsHidden, setButtonsHidden] = useState(true);

    const tasksList = tasks?.map((taskData: DocumentData) => {
		const task = {
			id: taskData.id,
			columnId: id,
			columnName: title,
			name: taskData.name,
			description: taskData.description,
			startDate: taskData.startDate?.toDate(),
			endDate: taskData.endDate?.toDate(),
			deadline: taskData.deadline?.toDate(),
			priority: taskData.priority,
			isDaySpecific: taskData.isDaySpecific,
			isScheduled: taskData.isScheduled,
			completed: taskData.completed,
			completeDate: taskData.completeDate?.toDate(),
		};

		return (
			<TaskCard
				key={ task.id }
				task={ task }
				isGridView={ true }
			/>)
		}
	);

    return (
        <Box sx={columnStyles} onMouseOver={() => setButtonsHidden(false)} onMouseOut={() => setButtonsHidden(true)}>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
            >
                <span className="column-title">{ title }</span>
                <div style={{...(buttonsHidden && {visibility: 'hidden'})}}>
                    <PopupIcon actionType="edit" entity="column" boardId={selectedProject.id} columnId={id}/>
                    <PopupIcon actionType="delete" entity="column" boardId={selectedProject.id}  columnId={id}/>
                </div>
            </Grid>

            <div className="todos">
                { tasksList }
            </div>
        </Box>
    )
}

export default Column;
