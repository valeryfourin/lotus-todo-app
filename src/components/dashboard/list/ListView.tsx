import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, DocumentData, orderBy, query } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { groupBy } from 'lodash';
import { authUser, firestore } from '../../../firebase';
import { selectedProjectSelector } from '../../store';
import { List } from './List';
import { ListHeader } from './ListHeader';
import { LoadingIcon } from '../../styledComponents';
import { MuiChipsInput } from 'mui-chips-input';

import './List.css';

export const ListView = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);

	const [keywords, setKeywords] = useState<Array<string>>([]);
	const [filteredTasks, setFilteredTasks] = useState<DocumentData[]>([]);

	useEffect(() => {
		if (keywords.length) {
			filterTasks();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keywords]);

	const filterTasks = () => {
		if (isDataLoaded) {
			const filtered = tasks.filter((task: DocumentData) => {
				let isMatch = false;
				keywords.forEach((keyword: string) => {
					if (task.name.toLowerCase().includes(keyword.toLowerCase())
						|| task.description.toLowerCase().includes(keyword.toLowerCase())
						|| task.priority.toLowerCase().includes(keyword.toLowerCase())) {
						isMatch = true;
					} else {
						columns.forEach((column: DocumentData) => {
							if (column.name.toLowerCase().includes(keyword.toLowerCase()) && column.id === task.columnId) {
								isMatch = true;
							}
						});
					}
				});
				return isMatch;
			});
			setFilteredTasks(filtered);
		}
	};

	const [columns, columnsLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns`), orderBy('createdAt')));

	const [tasks, tasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const isDataLoading = columnsLoading && tasksLoading;
	const isDataLoaded = columns && columns?.length && tasks && tasks?.length;

	const columnsById = groupBy(columns, 'id');
    return isDataLoading
		? (<LoadingIcon />)
		: isDataLoaded
			? (<>
				<MuiChipsInput
					sx={{ marginBottom: '30px' }}
					variant="outlined"
					value={keywords}
					onChange={setKeywords} />
				<ListHeader />
				{keywords.length && !filteredTasks?.length
					? <div className='message'>No tasks found with these filters.</div>
					: <List tasks={keywords.length ? filteredTasks : tasks} columns={columnsById}/>}
			</>) : (<div>No tasks created yet.</div>);
};
