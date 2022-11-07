import AddTodo from "../../AddTodo";
import { IColumnProps } from "../../../types";
import { Grid } from "@mui/material";
import { Task } from "./Task";
import PopupButton from "../../../sidebar/PopupButton";
import { useState } from "react";

const Column = ({ title, todos, deleteTodo, addTodo }: IColumnProps) => {
    const [buttonsHidden, setButtonsHidden] = useState(true);
    const todoList = todos.length ? (
        todos.map((todo: any) => {
            return (
                <Task 
                    key={ todo.id }
                    title={ todo.content }
                    // onClick={ () => deleteTodo(todo.id) }
                />
            )
        })
    ) : (
        <p className="center">You have no todo's left</p>
    )
    return ( 
        <div onMouseOver={() => setButtonsHidden(false)} onMouseOut={() => setButtonsHidden(true)}>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
            >
                <span className="column-title">{ title }</span>
                <div style={{...(buttonsHidden && {visibility: 'hidden'})}}>
                    <PopupButton actionType="edit" entity="column" color="secondary" />
                    <PopupButton actionType="delete" entity="column" color="secondary" />
                </div>
            </Grid>
                
            <div className="todos">
                { todoList }
            </div>
        </div>
    )
}

export default Column;