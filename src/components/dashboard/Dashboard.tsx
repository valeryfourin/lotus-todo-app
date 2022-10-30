import { updateProfile, User } from "firebase/auth";
import { useState } from "react";
import { Row } from "react-materialize";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../../firebase";
import Column from "../dashboard/Column";
import { userSelector } from "../store";
import { BoardNavbar } from "./BoardNavbar";

import './Dashboard.css';

export const Dashboard = (): JSX.Element => {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
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
            {   
                id: 4, 
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

      function updateName() {
        updateProfile(authUser.currentUser as User, {
          displayName: 'valery'
        }).then(() => {
          console.log(authUser.currentUser);
        }).catch((error: Error) => {
          alert(error.message);
        });
      }

    return (
        <Row className="dashboard-screen">
            <BoardNavbar />
            {state.columns && state.columns.map(col => {
                return (
                <div className="col s3" key={col.id}>
                    <Column id={ col.id } title={ col.title } todos={ col.content } deleteTodo={ deleteTodo } addTodo={ addTodo }/>
                </div>
                )
            })}
        </Row>
        );
};