import {
	Box,
	Button,
	Card,
	CardContent,
	CardActions,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { RefObject, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import DateSetter from '../dashboard/popupCreateButton/DateSetter';
import DateTimeSetter from '../dashboard/popupCreateButton/DateTimeSetter';
import PrioritySelect from '../dashboard/popupCreateButton/PrioritySelect';
import StatusSelect from '../dashboard/popupCreateButton/StatusSelect';
import { selectedProjectSelector } from '../store';
import { IEditDialogProps } from '../types';

export const EditDialog = ({task, handleExitEditingMode, handleConfirmClose}: IEditDialogProps) => {
	const { id, name, columnId, columnName = '', description, startDate, endDate, deadline, priority, isDaySpecific, isScheduled, completed, completeDate } = task;
	const selectedProject = useSelector(selectedProjectSelector);

	const nameReference: RefObject<HTMLInputElement> = useRef(null);
	const descriptionReference: RefObject<HTMLInputElement> = useRef(null);

	const [newColumnId, setNewColumnId] = useState(columnId);
	const [priorityCurrent, setPriorityCurrent] = useState(priority);
	const [deadlineCurrent, setDeadlineCurrent] = useState<Date | null>(deadline);
	const [startDateCurrent, setStartDateCurrent] = useState<Date | null>(startDate);
	const [endDateCurrent, setEndDateCurrent] = useState<Date | null>(endDate);
	const [isDaySpecificCurrent, setIsDaySpecificCurrent] = useState<boolean>(isDaySpecific);
	const [isScheduledCurrent, setIsScheduledCurrent] = useState<boolean>(isScheduled);

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};

	return (<>
		<DialogTitle>Edit {name}</DialogTitle>
			<DialogContent className="form-content">
				<TextField
					inputRef={nameReference}
					autoFocus
					margin="dense"
					id="name"
					label="Edit name..."
					defaultValue={name}
					type="text"
					fullWidth
					variant="standard"
					onKeyDown={preventProjectSwitch}
					required
				/>

				<Grid container spacing={2} rowSpacing={2} marginTop="5px">
					<Grid item xs>
						<PrioritySelect value={priorityCurrent} setValue={setPriorityCurrent}/>
					</Grid>
					<Grid item xs>
						<StatusSelect value={newColumnId} setValue={setNewColumnId} />
					</Grid>
				</Grid>

				<TextField
					inputRef={descriptionReference}
					margin="dense"
					id="name"
					label="Edit description..."
					defaultValue={description}
					multiline
					minRows={4}
					type="text"
					fullWidth
					variant="standard"
					onKeyDown={preventProjectSwitch}
				/>
				<FormControlLabel control={
					<Checkbox checked={isScheduledCurrent} onChange={(event) => setIsDaySpecificCurrent(event.target.checked)} />
					} label="Event is day specific" />
				<Grid container spacing={2} rowSpacing={2} marginTop="5px">
					<Grid item xs>
						<DateTimeSetter value={startDateCurrent} setValue={setStartDateCurrent} label="Start time" saveDay={isDaySpecificCurrent}/>
					</Grid>
					<Grid item xs>
						<DateTimeSetter value={endDateCurrent} setValue={setEndDateCurrent} label="End time" saveDay={isDaySpecificCurrent}/>
					</Grid>
				</Grid>
				<Box marginTop="15px">
					<DateSetter value={deadlineCurrent} setValue={setDeadlineCurrent}/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleExitEditingMode}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Save</Button>
			</DialogActions>
		</>
	);
};
