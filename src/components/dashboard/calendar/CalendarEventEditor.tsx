import { SyntheticEvent, useState } from "react";
import { ProcessedEvent, SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import DateTimeSetter from "../popupCreateButton/DateTimeSetter";
import { incorrectDateMessage, titleMissingMessage } from "../../../utils/constants";

interface CalendarEventEditorProps {
	scheduler: SchedulerHelpers;
}

interface EditEventDialogContentProps {
	startDate: Date | null;
	setStartDate: Function;
	endDate: Date | null;
	setEndDate: Function;
	error: Record<string, boolean>;
}

interface CreateEventDialogContentProps {
	state: Record<string, string>;
	handleChange: (event: SyntheticEvent, name: string) => void;
	startDate: Date | null;
	setStartDate: Function;
	endDate: Date | null;
	setEndDate: Function;
	error: boolean;
}

const defaultErrorState = {
	titleMissing: false,
	incorrectDate: false
};

export const CalendarEventEditor = ({ scheduler }: CalendarEventEditorProps) => {
	const event = scheduler.edited;

	const [startDateCurrent, setStartDateCurrent] = useState<Date | null>(event?.start || scheduler.state.start.value);
	const [endDateCurrent, setEndDateCurrent] = useState<Date | null>(event?.end || scheduler.state.end.value);
	const [state, setState] = useState({
		title: event?.title || '',
		description: event?.description || ''
	});
	const [error, setError] = useState(defaultErrorState);

	const closeDialog = () => {
		scheduler.close();
	};

	const handleSave = () => {
		setError(defaultErrorState);

		if (startDateCurrent && endDateCurrent && startDateCurrent.getTime() >= endDateCurrent.getTime()) {
			return setError({...error, incorrectDate: true});
		}

		if (!state.title) {
			return setError({...error, titleMissing: true});
		}

		const updatedEvent = {
			...event,
			event_id: event?.event_id || Math.random(),
			title: state.title,
			description: state.description,
			start: startDateCurrent,
			end: endDateCurrent,
		} as ProcessedEvent;
		scheduler.onConfirm(updatedEvent, event ? 'edit' : 'create');
		closeDialog();
	};

	const handleChange = (event: SyntheticEvent, name: string) => {
		if (error.titleMissing && name) {
			setError({...error, titleMissing: false});
		}
		setState((prev) => {
			return {
				...prev,
				[name]: (event.target as HTMLInputElement).value
			};
		});
	};

	return (<>
		<DialogTitle>{event ? 'Edit event' : 'Create new event'}</DialogTitle>
		<DialogContent className="form-content">
			{event
			? <EditEventDialogContent
				startDate={startDateCurrent}
				setStartDate={setStartDateCurrent}
				endDate={endDateCurrent}
				setEndDate={setEndDateCurrent}
				error={error}
				/>
			: <CreateEventDialogContent
				state={state}
				handleChange={handleChange}
				startDate={startDateCurrent}
				setStartDate={setStartDateCurrent}
				endDate={endDateCurrent}
				setEndDate={setEndDateCurrent}
				error={error.titleMissing}
				/>
			}
			{ error.incorrectDate ? (<div className="error-helper-text">{incorrectDateMessage}</div>) : null }
		</DialogContent>
		<DialogActions>
			<Button onClick={closeDialog}>Cancel</Button>
			<Button onClick={handleSave}>Save</Button>
		</DialogActions>
	</>)
};

const EditEventDialogContent = (props: EditEventDialogContentProps) => {
	const {startDate, setStartDate, endDate, setEndDate} = props;

	return (<>
		<Grid container spacing={2} rowSpacing={2} marginTop="5px">
			<Grid item xs>
				<DateTimeSetter value={startDate} setValue={setStartDate} label="Start time"/>
			</Grid>
			<Grid item xs>
				<DateTimeSetter value={endDate} setValue={setEndDate} label="End time"/>
			</Grid>
		</Grid>
	</>)
};

const CreateEventDialogContent = (props: CreateEventDialogContentProps) => {
	const {state, handleChange, startDate, setStartDate, endDate, setEndDate, error}= props;

	return (<>
		<TextField
			label="Title"
			value={state.title}
			onChange={(event) => handleChange(event, 'title')}
			margin="dense"
			error={error}
			helperText={error && titleMissingMessage}
			required
			fullWidth
		/>
		<TextField
			label="Description"
			value={state.description}
			onChange={(event) => handleChange(event, 'description')}
			margin="dense"
			fullWidth
		/>
		<Grid container spacing={1} marginTop="1px">
			<Grid item xs>
				<DateTimeSetter value={startDate} setValue={setStartDate} label="Start time"/>
			</Grid>
			<Grid item xs>
				<DateTimeSetter value={endDate} setValue={setEndDate} label="End time"/>
			</Grid>
		</Grid>
	</>)
};
