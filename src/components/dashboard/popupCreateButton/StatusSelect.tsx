import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, DocumentData, orderBy, query } from 'firebase/firestore';
import { authUser, firestore } from '../../../firebase';
import { selectedProjectSelector } from '../../store';
import { CircularProgress } from '@mui/material';

export default function StatusSelect({value, setValue}: {value: string, setValue: Function}): JSX.Element {
	const selectedProject = useSelector(selectedProjectSelector);

	const handleChange = (event: SelectChangeEvent) => {
		setValue(event.target.value);
	};

	const [columns, loading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns`), orderBy('createdAt')));

	const areColumnsLoaded = columns && columns.length;

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl required fullWidth>
				<InputLabel id="demo-simple-select-label">Status</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={value}
					margin="dense"
					label="Status"
					onChange={handleChange}
				>
					{loading ?
						(
							<Box sx={{ display: 'flex', justifyContent: 'center' }}>
								<CircularProgress />
							</Box>
						) : (
							areColumnsLoaded ? columns.map((col: DocumentData) => (
							<MenuItem key={col.id} value={col.id}>
								{col.name}
							</MenuItem>
							)) : (
								<MenuItem >
									No columns found. Project must contain at least one column.
								</MenuItem>
							)
						)
					}
				</Select>
			</FormControl>
		</Box>
  );
}
