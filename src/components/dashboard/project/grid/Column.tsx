import { IColumnProps, TTask } from "../../../types";
import { Box, CircularProgress, Grid } from "@mui/material";
import { TaskCard } from "./TaskCard";
import PopupIcon from "../../../sidebar/PopupIcon";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectedProjectSelector } from "../../../store";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { authUser, firestore } from "../../../../firebase";

const Column = ({ title, id }: IColumnProps) => {
    const selectedProject = useSelector(selectedProjectSelector);
    const [buttonsHidden, setButtonsHidden] = useState(true);

	const [tasks, loading, error] = useCollection(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns/${title}/tasks`));

    const tasksList = loading ? (
		<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			<CircularProgress />
		</Box>
    ) : (
        tasks?.docs.map((task: any) => {
            return (
                <TaskCard
                    key={ task.id }
					id={ task.id }
					columnId={ id }
					columnName={ title }
                    name={ task.data().name }
					description={ task.data().description }
					deadline={ task.data().deadline?.toDate() }
					priority={ task.data().priority }
                />
            )
        })
    )
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
