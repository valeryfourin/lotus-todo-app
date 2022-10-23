import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
};

const todoSlice = createSlice({
    name: "Todo",
    initialState,
    reducers: {
        saveTodo: (state, action) => {
            state.todoList.push(action.payload)
        }
    }
});

export const { } = todoSlice.actions;
export default todoSlice.reducer