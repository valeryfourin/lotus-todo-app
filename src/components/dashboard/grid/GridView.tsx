import { useSelector } from "react-redux";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Grid } from "@mui/material";
import { groupBy } from 'lodash';
import { collection, orderBy, query } from "firebase/firestore";
import { authUser, firestore } from "../../../firebase";
import PopupIcon from "../../sidebar/PopupIcon";
import { selectedProjectSelector } from "../../store";
import Column from "./Column";
import { LoadingIcon } from "../../styledComponents";

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
	const isDataLoaded = columns && columns?.length;

	const tasksByColumn = groupBy(tasks, 'columnId');

	return isDataLoading ? (
			<LoadingIcon />
		) : (
			<Grid container className="grid custom-scroll" spacing={3} wrap="nowrap" sx={{ overflowX: 'scroll', marginTop: '0px', paddingLeft: '25px' }}>
				{isDataLoaded ? (
					<>
						{columns.map(col => (
							<div className="grid-item" key={col.id}>
								<Column id={col.id} title={col.name} tasks={tasksByColumn[col.id]} />
							</div>
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
