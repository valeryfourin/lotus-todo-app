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

export const DetailsDialog = ({task, taskNameFormatted, setEditingMode, handleCancelClose, toggleTaskDone, toggleScheduled}: IDetailsDialogProps) => {
	const { id, name, columnName = '', description, startDate, endDate, deadline, priority, isDaySpecific, isScheduled, completed, completeDate } = task;
	const selectedProject = useSelector(selectedProjectSelector);

	return (<>
		<DialogTitle>
			<Grid container justifyContent="space-between">
				<span>Details of "{taskNameFormatted}"</span>
				<Box sx={{cursor: 'pointer'}}>
					<EditOutlinedIcon onClick={() => setEditingMode(true)}/>
					<PopupDeleteTaskIcon name={ name } boardId={ selectedProject.id } taskId={ id } />
					<DoneOutlineIcon onClick={toggleTaskDone}/>
				</Box>
			</Grid>

		</DialogTitle>
		<DialogContent className="form-content">
				<Typography variant="body2">{ description }</Typography>

				<Box marginTop="50px">
					Status: <Button variant="outlined">{ columnName }</Button>
				</Box>
				<Box marginTop="10px">
					Priority: <TripOriginIcon sx={{ color: PriorityColor[priority as Priority], verticalAlign: 'middle' }} /> { priority }
				</Box>
				<Box marginTop="10px">
					Start: { startDate ? (
					<Button size="small">
						{isDaySpecific
							? startDate.toLocaleDateString("en-US", dateTimeOptions)
							: startDate.toLocaleTimeString("en-US", timeOptions)}
					</Button>) : 'Not set' }
				</Box>
				<Box marginTop="10px">
					End: { endDate ? (
					<Button size="small">
						{isDaySpecific
							? endDate.toLocaleDateString("en-US", dateTimeOptions)
							: endDate.toLocaleTimeString("en-US", timeOptions)}
					</Button>) : 'Not set' }
				</Box>
				<Box marginTop="10px">
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
