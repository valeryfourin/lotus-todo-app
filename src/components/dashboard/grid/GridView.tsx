import { CircularProgress, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { authUser, firestore } from "../../../firebase";
import PopupIcon from "../../sidebar/PopupIcon";
import { selectedProjectSelector } from "../../store";
import Column from "./Column";
import { groupBy } from 'lodash';

import "./GridView.css";

const addColumnButtonStyles = {
	right: '30px',
    height: '90%',
	borderRadius: 'unset',
}

export const GridView = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);

	const [columns, columnsLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns`), orderBy('createdAt')));

	const [tasks, tasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const isDataLoading = columnsLoading && tasksLoading;
	const isDataLoaded = columns && columns?.length && tasks && tasks?.length;

	const tasksByColumn = groupBy(tasks, 'columnId');

	return isDataLoading ? (
		<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			<CircularProgress />
		</Box>
		) : (
		<Grid container className="grid custom-scroll" spacing={3} wrap="nowrap" sx={{ overflowX: 'scroll', marginTop: '0px' }}>
			{isDataLoaded ? (
				<>
					{columns.map(col => (
						<Grid item key={col.id}>
							<Column id={col.id} title={col.name} tasks={tasksByColumn[col.id]} />
						</Grid>
						)
					)}
					<PopupIcon
						actionType="add"
						boardId={selectedProject.id}
						entity="column"
						styles={
							{
								...addColumnButtonStyles,
								position: 'fixed'
							}}
					/>
				</>) : <div>
					<span>No data yet. Start by creating a column</span>
					<PopupIcon actionType="add" boardId={selectedProject.id} entity="column" />
				</div>}
		</Grid>
	)
};
