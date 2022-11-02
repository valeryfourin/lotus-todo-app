import AddTodo from "./AddTodo";
import { IColumnProps } from "../types";
import { Card, TextField } from "@mui/material";
import { Task } from "./Task";
import { StyledTextField } from "../styledComponents";

const Column = ({ title, todos, deleteTodo, addTodo }: IColumnProps) => {
    const todoList = todos.length ? (
        todos.map((todo: any) => {
            return (
                <Task 
                    className="card-panel hoverable" 
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
        <>
            <h4 className="blue-text">{ title }</h4>
            {/* <AddTodo addTodo={ addTodo }/> */}
            <StyledTextField id="outlined-basic" label="Outlined" variant="outlined" type='email'/>
            <div className="todos">
                { todoList }
            </div>
        </>
    )
}

export default Column;