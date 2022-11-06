import AddTodo from "../../AddTodo";
import { IColumnProps } from "../../../types";
import { Card, Grid, TextField } from "@mui/material";
import { Task } from "./Task";
import PopupButton from "../../../sidebar/PopupButton";

const Column = ({ title, todos, deleteTodo, addTodo }: IColumnProps) => {
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
        <div>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
            >
               <span className="column-title">{ title }</span>
               <div>
                  <PopupButton actionType="edit" entity="column" color="secondary" />
                  <PopupButton actionType="delete" entity="column" color="secondary" />
                </div>
            </Grid>
                
            {/* <AddTodo addTodo={ addTodo }/> */}
            {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" type='text'/> */}
            <div className="todos">
                { todoList }
            </div>
        </div>
    )
}

export default Column;