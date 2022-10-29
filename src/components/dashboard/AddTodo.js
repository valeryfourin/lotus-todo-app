import { useState } from "react";

const AddTodo = ({addTodo}) => {
    const [todo, setTodo] = useState({
        content: 'take over the universe...'
    }); 
    
    const handleChange = (e) => {
        setTodo({
            content: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (todo.content.length > 0 ) {
            addTodo(todo);
            setTodo({
                content: ""
            })
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Add new todo:</label>
                <input type="text" onChange={handleChange} value={todo.content}/>
            </form>
        </div>
    )
}

export default AddTodo;