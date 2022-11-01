import AddTodo from "./AddTodo";
import { IColumnProps } from "../types";
import { Card, TextField } from "@mui/material";

const Column = ({ title, todos, deleteTodo, addTodo }: IColumnProps) => {
    const todoList = todos.length ? (
        todos.map((todo: any) => {
            return (
                <Card 
                    className="card-panel hoverable" 
                    key={ todo.id }
                    onClick={ () => deleteTodo(todo.id) }
                >
                    <span>{ todo.content }</span>
                </Card>
            )
        })
    ) : (
        <p className="center">You have no todo's left</p>
    )
    return ( 
        <>
            <h4 className="blue-text">{ title }</h4>
            {/* <AddTodo addTodo={ addTodo }/> */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <div className="todos">
                { todoList }
            </div>
        </>
    )
}

export default Column;