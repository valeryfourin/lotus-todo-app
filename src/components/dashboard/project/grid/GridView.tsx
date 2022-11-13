import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { collection } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { authUser, firestore } from "../../../../firebase";
import PopupIcon from "../../../sidebar/PopupIcon";
import { selectedProjectSelector } from "../../../store";
import Column from "./Column";

import "./GridView.css";

export const GridView = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);

	const [state, setState] = useState({
				dashboard: 'Custom name',
				columns: [
						{
							id: 1,
							title: "todo",
								content: [
									{ id: 1, content: "read book", date: "1995-12-17T03:24:00" },
									{ id: 2, content: "start unit test course", date: "1995-12-17T03:24:00" },
									{ id: 3, content: "fix bug", date: "1995-12-17T03:24:00" },
									{ id: 4, content: "fix bug", date: "1995-12-17T03:24:00" },
									{ id: 5, content: "fix bug", date: "1995-12-17T03:24:00" },
									{ id: 6, content: "fix bug", date: "1995-12-17T03:24:00" },
									{ id: 7, content: "fix bug", date: "1995-12-17T03:24:00" }
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
								title: "fixed",
									content: [
										{ id: 1, content: "read book", date: "1995-12-17T03:24:00" },
										{ id: 2, content: "start course", date: "1995-12-17T03:24:00" },
										{ id: 3, content: "fix bug", date: "1995-12-17T03:24:00" }
									]
							},
							{
								id: 5,
								title: "closed",
									content: [
										{ id: 1, content: "read book", date: "1995-12-17T03:24:00" },
										{ id: 2, content: "start course", date: "1995-12-17T03:24:00" },
										{ id: 3, content: "fix bug", date: "1995-12-17T03:24:00" }
									]
							},
							{
								id: 6,
								title: "saved",
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

	const [columns, loading, error] = useCollection(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns`));

	const columnsReversed = useMemo(() => {
		if (!loading) {
			return columns?.docs.reverse();
		}
	}, columns?.docs);
	const areColumnsLoaded = columns !== undefined && columns?.docs.length;

	return loading ? (
		<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			<CircularProgress />
		</Box>
		) : (
		<Grid container className="grid custom-scroll" spacing={3} wrap="nowrap" sx={{ overflowX: 'scroll', marginTop: '0px' }}>
			{areColumnsLoaded ? (
				<>
					{columnsReversed && columnsReversed.map(col => (
						<Grid item key={col.id}>
							<Column id={ col.id } title={ col.data().name } />
						</Grid>
						)
					)}
					<PopupIcon actionType="add" boardId={selectedProject.id} entity="column" styles={{borderRadius: 'unset'}} />
				</>) : <div>
					<span>No data yet. Start by creating a column</span>
					<PopupIcon actionType="add" boardId={selectedProject.id} entity="column" />
				</div>}
		</Grid>
	)
};
