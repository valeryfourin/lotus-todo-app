import React from "react";
import AddTodo from "./AddTodo";

const DashboardColumn = ({ title, todos, deleteTodo, addTodo }) => {
    const todoList = todos.length ? (
        todos.map(todo => {
            return (
                <div 
                    className="card-panel hoverable" 
                    key={ todo.id }
                    onClick={ () => deleteTodo(todo.id) }
                >
                    <span>{ todo.content }</span>
                </div>
            )
        })
    ) : (
        <p className="center">You have no todo's left</p>
    )
    return ( 
        <>
            <h4 className="blue-text">{ title }</h4>
            <AddTodo addTodo={ addTodo }/>
            <div className="todos">
                { todoList }
            </div>
        </>
    )
}

export default DashboardColumn;