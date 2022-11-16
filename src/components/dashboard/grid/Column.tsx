
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, DocumentData, orderBy, query } from "firebase/firestore";
import { Box, CircularProgress, Grid } from "@mui/material";
import { IColumnProps } from "../../types";
import { TaskCard } from "./TaskCard";
import PopupIcon from "../../sidebar/PopupIcon";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectedProjectSelector } from "../../store";
import { authUser, firestore } from "../../../firebase";

const Column = ({ title, id }: IColumnProps) => {
    const selectedProject = useSelector(selectedProjectSelector);
    const [buttonsHidden, setButtonsHidden] = useState(true);

	const [tasks, loading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns/${id}/tasks`), orderBy('createdAt')));

    const tasksList = loading ? (
		<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			<CircularProgress />
		</Box>
    ) : (
        tasks?.map((task: DocumentData) => (
			<TaskCard
				key={ task.id }
				id={ task.id }
				columnId={ id }
				columnName={ title }
				name={ task.name }
				description={ task.description }
				deadline={ task.deadline?.toDate() ?? null }
				priority={ task.priority }
			/>
            )
        )
    );

    return (
        <Box sx={{minWidth: '150px'}} onMouseOver={() => setButtonsHidden(false)} onMouseOut={() => setButtonsHidden(true)}>
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
