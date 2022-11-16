
import { RefObject, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrioritySelect from './PrioritySelect';
import DateSetter from './DateSetter';
import StatusSelect from './StatusSelect';
import { addTask } from '../../../services/firestore/taskService';
import { selectedProjectSelector } from '../../store';
import { Priority } from '../../types';

import './PopupCreateButton.css';

export const PopupCreateButton = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);
	const [open, setOpen] = useState(false);
	const nameReference: RefObject<HTMLInputElement> = useRef(null);
	const descriptionReference: RefObject<HTMLInputElement> = useRef(null);

	const [status, setStatus] = useState('');
	const [priority, setPriority] = useState(Priority.notSet);
	const [deadline, setDeadline] = useState<Date | null>(null);

	const handleClickOpen = (event: any): void => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: any): void => {
		preventProjectSwitch(event);

		if (nameReference.current && status) {
			const task = {
				name: nameReference.current.value,
				description: descriptionReference.current !== null ? descriptionReference.current.value : '',
				priority,
				status,
				deadline,
			};

			addTask(selectedProject.id, status, task);
			resetState();
			setOpen(false);
		} else {
			alert('Missing required fields.');
		}
	};

	const handleCancelClose = (event: any): void => {
		preventProjectSwitch(event);
		setOpen(false);
	};

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};
	const resetState = (): void => {
		setStatus('');
		setPriority(Priority.notSet);
		setDeadline(null);
	};

	return (
    <>
		<Button className="create-button" variant="outlined" endIcon={<AddIcon />} onClick={handleClickOpen} sx={{margin: '0px 0px 12px 20px'}}>
			Create task
		</Button>
		<Dialog open={open} onClose={preventProjectSwitch} onClick={preventProjectSwitch} fullWidth={true} maxWidth="sm">
			<DialogTitle>Create new task</DialogTitle>
			<DialogContent className="form-content">
				<TextField
					inputRef={nameReference}
					autoFocus
					margin="dense"
					id="name"
					label="Enter name..."
					type="text"
					fullWidth
					variant="standard"
					onKeyDown={preventProjectSwitch}
					required
				/>

				<Grid container spacing={2} rowSpacing={2} marginTop="5px">
					<Grid item xs>
						<PrioritySelect value={priority} setValue={setPriority}/>
					</Grid>
					<Grid item xs>
						<StatusSelect value={status} setValue={setStatus} />
					</Grid>
				</Grid>

				<TextField
					inputRef={descriptionReference}
					margin="dense"
					id="name"
					label="Enter description..."
					multiline
					minRows={4}
					type="text"
					fullWidth
					variant="standard"
					onKeyDown={preventProjectSwitch}
				/>
				<Box marginTop="15px" marginBottom="15px">
					<DateSetter value={deadline} setValue={setDeadline}/>
				</Box>
				<Button variant="contained" component="label">
					Upload files
					<input hidden accept="image/*" multiple type="file" />
				</Button>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancelClose}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Create</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
