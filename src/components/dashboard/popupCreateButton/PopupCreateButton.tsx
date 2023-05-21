
import { RefObject, SyntheticEvent, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Checkbox, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrioritySelect from './PrioritySelect';
import DateSetter from './DateSetter';
import DateTimeSetter from './DateTimeSetter';
import ColumnSelect from './ColumnSelect';
import { addTask } from '../../../services/firestore/taskService';
import { selectedProjectSelector } from '../../store';
import { Priority } from '../../types';

import './PopupCreateButton.css';
import { columnMissingMessage, incorrectDateMessage, incorrectDeadlineMessage, marginSpacing, titleMissingMessage } from '../../../utils/constants';
import { preventProjectSwitch } from '../../../utils/helpers';

const defaultErrorState = {
	missingName: false,
	missingColumnId: false,
	incorrectDate: false,
	incorrectDeadline: false,
};

export const PopupCreateButton = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);
	const [open, setOpen] = useState(false);
	const nameReference: RefObject<HTMLInputElement> = useRef(null);
	const descriptionReference: RefObject<HTMLInputElement> = useRef(null);

	const [columnId, setColumnId] = useState<string>('');
	const [priority, setPriority] = useState(Priority.notSet);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [deadline, setDeadline] = useState<Date | null>(null);
	const [isDaySpecific, setIsDaySpecific] = useState<boolean>(false);

	const [error, setError] = useState(defaultErrorState);

	const handleClickOpen = (event: SyntheticEvent): void => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: SyntheticEvent): void => {
		preventProjectSwitch(event);
		setError(defaultErrorState);

		if (startDate && endDate && startDate.getTime() >= endDate.getTime()) {
			return setError({...error, incorrectDate: true});
		}

		if (isDaySpecific && startDate && endDate && deadline
			&& (deadline.getTime() < endDate.getTime() || deadline.getTime() <= startDate.getTime())) {
				return setError({...error, incorrectDeadline: true});
		}

		if (!nameReference.current?.value) {
			return setError({...error, missingName: true});
		}

		if (!columnId) {
			return setError({...error, missingColumnId: true});
		}

		const task = {
			name: nameReference.current.value,
			description: descriptionReference.current !== null ? descriptionReference.current.value : '',
			priority,
			columnId,
			startDate,
			endDate,
			deadline,
			isDaySpecific,
			completed: false
		};

		addTask(selectedProject.id, task);
		resetState();
		setOpen(false);
	};

	const handleCancelClose = (event: SyntheticEvent): void => {
		preventProjectSwitch(event);
		resetState();
		setOpen(false);
	};

	const resetState = (): void => {
		setColumnId('');
		setPriority(Priority.notSet);
		setDeadline(null);
		setError(defaultErrorState);
	};

	const textFieldKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>): void => {
		preventProjectSwitch(event);
		setError({...error, missingName: false});
	};

	return (
    <>
		<Button className="create-button" variant="outlined" endIcon={<AddIcon />} onClick={handleClickOpen} sx={marginSpacing}>
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
					onKeyDown={textFieldKeyDownHandler}
					error={error.missingName}
					helperText={error.missingName && titleMissingMessage}
					required
				/>

				<Grid container spacing={2} rowSpacing={2} marginTop="5px">
					<Grid item xs>
						<PrioritySelect value={priority} setValue={setPriority}/>
					</Grid>
					<Grid item xs>
						<ColumnSelect value={columnId} setValue={setColumnId} />
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
				<FormControlLabel control={
					<Checkbox checked={isDaySpecific} onChange={(event) => setIsDaySpecific(event.target.checked)} />
					} label="Event is day specific" />
				<Grid container spacing={2} rowSpacing={2} marginTop="5px">
					<Grid item xs>
						<DateTimeSetter value={startDate} setValue={setStartDate} label="Start time" saveDay={isDaySpecific}/>
					</Grid>
					<Grid item xs>
						<DateTimeSetter value={endDate} setValue={setEndDate} label="End time" saveDay={isDaySpecific}/>
					</Grid>
				</Grid>
				<Box marginTop="15px">
					<DateSetter value={deadline} setValue={setDeadline}/>
				</Box>

				{ error.incorrectDate ? (<div className="error-helper-text">{incorrectDateMessage}</div>) : null }
				{ error.incorrectDeadline ? (<div className="error-helper-text">{incorrectDeadlineMessage}</div>) : null }
				{ error.missingColumnId ? (<div className="error-helper-text">{columnMissingMessage}</div>) : null }
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancelClose}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Create</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
