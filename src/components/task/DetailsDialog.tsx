import {
	Box,
	Button,
	Checkbox,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	Typography,
} from '@mui/material';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PopupDeleteTaskIcon from '../dashboard/grid/PopupDeleteTaskIcon';
import { IDetailsDialogProps, Priority, PriorityColor } from '../types';
import { useSelector } from 'react-redux';
import { selectedProjectSelector } from '../store';
import { dateTimeOptions, timeOptions } from '../../utils/constants';
import { setTaskCompleted, setTaskScheduled } from '../../services/firestore/taskService';

export const DetailsDialog = ({task, taskNameFormatted, setEditingMode, handleCancelClose}: IDetailsDialogProps) => {
	const { id, name, columnName = '', description, startDate, endDate, deadline, priority, estimate, isDaySpecific, isScheduled, completed, completeDate } = task;
	const selectedProject = useSelector(selectedProjectSelector);

	const toggleTaskDone = () => {
		setTaskCompleted(selectedProject.id, id, !completed);
	}

	const toggleScheduled = (isScheduled: boolean) => {
		setTaskScheduled(selectedProject.id, id, isScheduled);
	}

	return (<>
		<DialogTitle>
			<Grid container justifyContent="space-between">
				<span>Details of "{taskNameFormatted}"</span>
				<Box sx={{cursor: 'pointer'}}>
					<DoneOutlineIcon onClick={toggleTaskDone}/>
					<EditOutlinedIcon onClick={() => setEditingMode(true)}/>
					<PopupDeleteTaskIcon name={ name } boardId={ selectedProject.id } taskId={ id } />
				</Box>
			</Grid>

		</DialogTitle>
		<DialogContent className="form-content">
				<Typography variant="body2">{ description }</Typography>

				<Box marginTop="50px">
					Column: <Button variant="outlined">{ columnName }</Button>
				</Box>
				<Box marginTop="10px">
					Priority: <TripOriginIcon sx={{ color: PriorityColor[priority as Priority], verticalAlign: 'middle' }} /> { priority }
				</Box>
				{ estimate ? (
					<Box marginTop="10px">
						Estimate: { `${estimate} ${estimate === 1 ? 'hour' : 'hours'}` }
					</Box>
				) : null}
				<Box marginTop="8px">
					Start: { startDate ? (
					<Button size="small">
						{isDaySpecific
							? startDate.toLocaleDateString("en-US", dateTimeOptions)
							: startDate.toLocaleTimeString("en-US", timeOptions)}
					</Button>) : 'Not set' }
				</Box>
				<Box marginTop="8px">
					End: { endDate ? (
					<Button size="small">
						{isDaySpecific
							? endDate.toLocaleDateString("en-US", dateTimeOptions)
							: endDate.toLocaleTimeString("en-US", timeOptions)}
					</Button>) : 'Not set' }
				</Box>
				<Box marginTop="8px">
					Deadline: { deadline ? (<Button size="small">{deadline.toLocaleDateString("en-US", dateTimeOptions)}</Button>) : 'Not set' }
				</Box>
				<Box marginTop="10px">
					Completed: { completeDate ? (<Button size="small">{completeDate.toLocaleDateString("en-US", dateTimeOptions)}</Button>) : 'Not yet completed' }
				</Box>

				{ !completed && (
					<FormControlLabel control={
						<Checkbox checked={isScheduled} onChange={(event) => toggleScheduled(event.target.checked)} />
						} label="Include in schedule" />
				)}
		</DialogContent>
		<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
		</DialogActions>
	</>);
};
