import { useState } from "react";
import { useDispatch } from "react-redux";
import Column from "../dashboard/Column";
import { Header } from "../header";
import { logout } from "../store";

export const Home = (): JSX.Element => {
  const dispatch = useDispatch();
    const [state, setState] = useState({
        dashboard: 'Custom name',
        columns: [
            { 
              id: 1,  
              title: "todo",
                content: [
                  { id: 1, content: "read book", date: "1995-12-17T03:24:00" },
                  { id: 2, content: "start unit test course", date: "1995-12-17T03:24:00" },
                  { id: 3, content: "fix bug", date: "1995-12-17T03:24:00" }
                ]
            },
            { 
              id: 2,   
              title: "in progress",
                content: [
                  { id: 1, content: "blog about workspace", date: "1995-12-17T03:24:00" },
                  { id: 2, content: "start react course", date: "1995-12-17T03:24:00" }
                ]
            },
            {   
              id: 3, 
              title: "done",
                content: [
                  { id: 1, content: "read book", date: "1995-12-17T03:24:00" },
                  { id: 2, content: "start course", date: "1995-12-17T03:24:00" },
                  { id: 3, content: "fix bug", date: "1995-12-17T03:24:00" }
                ]
            },
        ]
    });
    
      const [todos, setTodos] = useState([
        { id: 1, content: "read book" },
        { id: 2, content: "start course" },
        { id: 3, content: "fix bug" }
      ]);
    
      function deleteTodo(id: any) {
        const newTodos = todos.filter( (todo) => todo.id !== id ); 
        setTodos( newTodos );
      }
    
      function addTodo(todo: any) {
        setTodos([ ...todos, { id: (todos.length + 1), ...todo } ])
      }

    return (
        <div>
          <button type="button" onClick={() => dispatch(logout())}>Sign out</button>
            <Header />
            <div className="row">
            {state.columns && state.columns.map(col => {
                return (
                <div className="col s4" key={col.id}>
                    <Column id={ col.id } title={ col.title } todos={ col.content } deleteTodo={ deleteTodo } addTodo={ addTodo }/>
                </div>
                )
            })}
            </div>
        </div>
        );
}