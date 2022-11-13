import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { RefObject, useRef, useState } from 'react';
import PrioritySelect from './PrioritySelect';
import './PopupCreateButton.css';
import DateSetter from './DateSetter';
import StatusSelect from './StatusSelect';
import { addTask } from '../../../../services/firestore/taskService';
import { useSelector } from 'react-redux';
import { selectedProjectSelector } from '../../../store';
import { Box } from '@mui/system';
import { Priority } from '../../../types';

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
				createdDate: new Date(),
			};
			console.log(task);

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
	}

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};
	const resetState = (): void => {
		setStatus('');
		setPriority(Priority.notSet);
		setDeadline(null);
	}

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
				<Box marginTop="5px">
					<DateSetter value={deadline} setValue={setDeadline}/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancelClose}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Create</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
