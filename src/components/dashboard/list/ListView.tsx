import { Box, CircularProgress, TextField } from '@mui/material';
import { collection, orderBy, query } from 'firebase/firestore';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
import { authUser, firestore } from '../../../firebase';
import { selectedProjectSelector } from '../../store';
import { List } from './List';
import { groupBy } from 'lodash';

import "./List.css";
import { ListHeader } from './ListHeader';

export const ListView = (): JSX.Element => {
	const [items, setItems] = useState();

	const selectedProject = useSelector(selectedProjectSelector);

	const [columns, columnsLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns`), orderBy('createdAt')));

	const [tasks, tasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const isDataLoading = columnsLoading && tasksLoading;
	const isDataLoaded = columns && columns?.length && tasks && tasks?.length;

	const columnsById = groupBy(columns, 'id');
    return (
        <>
			<TextField className="search-query" sx={{ marginBottom: '20px', width: 400}} id="standard-basic" label="Search for tasks..." variant="standard" />
			<ListHeader />
			{
				isDataLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box>
					) : isDataLoaded && (<List tasks={tasks} columns={columnsById}/>)
			}
		</>
	);
};
