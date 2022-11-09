import { IColumnProps } from "../../../types";
import { Box, Grid } from "@mui/material";
import { Task } from "./Task";
import PopupIcon from "../../../sidebar/PopupIcon";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectedProjectSelector } from "../../../store";

const Column = ({ title, id }: IColumnProps) => {
    const selectedProject = useSelector(selectedProjectSelector);
    const [buttonsHidden, setButtonsHidden] = useState(true);
    // const todoList = todos.length ? (
    //     todos.map((todo: any) => {
    //         return (
    //             <Task
    //                 key={ todo.id }
    //                 title={ todo.content }
    //                 // onClick={ () => deleteTodo(todo.id) }
    //             />
    //         )
    //     })
    // ) : (
    //     <p className="center">You have no todo's left</p>
    // )
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
                {/* { todoList } */}
            </div>
        </Box>
    )
}

export default Column;
