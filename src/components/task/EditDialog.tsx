import { RefObject, SyntheticEvent, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Box,
	Button,
	Checkbox,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { editTask } from '../../services/firestore/taskService';
import { incorrectDateMessage, incorrectDeadlineMessage, marginSpacing, titleMissingMessage } from '../../utils/constants';
import { preventProjectSwitch } from '../../utils/helpers';
import DateSetter from '../dashboard/popupCreateButton/DateSetter';
import DateTimeSetter from '../dashboard/popupCreateButton/DateTimeSetter';
import PrioritySelect from '../dashboard/popupCreateButton/PrioritySelect';
import ColumnSelect from '../dashboard/popupCreateButton/ColumnSelect';
import { selectedProjectSelector } from '../store';
import { IEditDialogProps, Priority } from '../types';

const defaultErrorState = {
	missingName: false,
	incorrectDate: false,
	incorrectDeadline: false,
};

export const EditDialog = ({task, handleCancelClose}: IEditDialogProps) => {
	const { id, name, columnId, description, startDate = null, endDate = null, deadline = null, priority, estimate, isDaySpecific } = task;
	const selectedProject = useSelector(selectedProjectSelector);

	const nameReference: RefObject<HTMLInputElement> = useRef(null);
	const descriptionReference: RefObject<HTMLInputElement> = useRef(null);
	const estimateReference: RefObject<HTMLInputElement> = useRef(null);

	const [newColumnId, setNewColumnId] = useState(columnId);
	const [priorityCurrent, setPriorityCurrent] = useState(priority);
	const [deadlineCurrent, setDeadlineCurrent] = useState<Date | null>(deadline);
	const [startDateCurrent, setStartDateCurrent] = useState<Date | null>(startDate);
	const [endDateCurrent, setEndDateCurrent] = useState<Date | null>(endDate);
	const [isDaySpecificCurrent, setIsDaySpecificCurrent] = useState<boolean>(isDaySpecific);

	const [error, setError] = useState(defaultErrorState);

	const handleConfirmClose = async (event: SyntheticEvent): Promise<void> => {
		preventProjectSwitch(event);
		setError(defaultErrorState);

		if (!nameReference.current?.value) {
			return setError({...error, missingName: true});
		}

		if (startDateCurrent && endDateCurrent && startDateCurrent.getTime() >= endDateCurrent.getTime()) {
			return setError({...error, incorrectDate: true});
		}

		if (isDaySpecificCurrent
			&& startDateCurrent
			&& endDateCurrent
			&& deadlineCurrent
			&& (deadlineCurrent.getTime() < endDateCurrent.getTime() || deadlineCurrent.getTime() <= startDateCurrent.getTime())) {
				return setError({...error, incorrectDeadline: true});
		}

		const task = {
			name: nameReference.current.value,
			description: descriptionReference.current !== null ? descriptionReference.current.value : '',
			priority: priorityCurrent as Priority,
			estimate: estimateReference.current !== null ? Math.abs(parseFloat(estimateReference.current.value)) : 0,
			columnId: newColumnId,
			startDate: startDateCurrent,
			endDate: endDateCurrent,
			deadline: deadlineCurrent,
			isDaySpecific: isDaySpecificCurrent,
		};

		await editTask(selectedProject.id, id, task);
		handleCancelClose(task);
	};

	const textFieldKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>): void => {
		preventProjectSwitch(event);
		setError({...error, missingName: false});
	};

	const handleClearDates = (): void => {
		setStartDateCurrent(null);
		setEndDateCurrent(null);
		setDeadlineCurrent(null);
	};

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
					onKeyDown={textFieldKeyDownHandler}
					error={error.missingName}
					helperText={error.missingName && titleMissingMessage}
					required
				/>

				<Grid item xs>
					<TextField
						inputRef={estimateReference}
						sx={{width: '150px'}}
						label="Estimate in hours"
						defaultValue={estimate}
						type="number"
						variant="standard"
						InputProps={{ inputProps: { min: 0, max: 100, pattern: '[0-9]*' }, inputMode: 'numeric' }}
					/>
				</Grid>

				<Grid container spacing={2} rowSpacing={2} marginTop="5px">
					<Grid item xs>
						<PrioritySelect value={priorityCurrent} setValue={setPriorityCurrent}/>
					</Grid>
					<Grid item xs>
						<ColumnSelect value={newColumnId} setValue={setNewColumnId} />
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
					<Checkbox checked={isDaySpecificCurrent} onChange={(event) => setIsDaySpecificCurrent(event.target.checked)} />
					} label="Event is day specific" />
				<Grid container spacing={2} rowSpacing={2} marginTop="5px">
					<Grid item xs>
						<DateTimeSetter value={startDateCurrent} setValue={setStartDateCurrent} label="Start time" saveDay={isDaySpecificCurrent}/>
					</Grid>
					<Grid item xs>
						<DateTimeSetter value={endDateCurrent} setValue={setEndDateCurrent} label="End time" saveDay={isDaySpecificCurrent}/>
					</Grid>
				</Grid>
				<Box marginTop="15px" marginBottom="10px">
					<DateSetter value={deadlineCurrent} setValue={setDeadlineCurrent}/>

					{ (startDateCurrent || endDateCurrent || deadlineCurrent) &&
						(<Button className="create-button" variant="outlined" endIcon={<ClearIcon />} onClick={handleClearDates} sx={marginSpacing}>
							Clear all dates fields
						</Button>)
					}
				</Box>

				{ error.incorrectDate ? (<div className="error-helper-text">{incorrectDateMessage}</div>) : null }
				{ error.incorrectDeadline ? (<div className="error-helper-text">{incorrectDeadlineMessage}</div>) : null }
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleCancelClose()}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Save</Button>
			</DialogActions>
		</>
	);
};
