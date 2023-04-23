import { RefObject, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TripOriginIcon  from '@mui/icons-material/TripOrigin';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip } from '@mui/material';
import { Priority, PriorityColor } from '../../types';
import { editTask, switchTaskColumn } from '../../../services/firestore/taskService';
import DateSetter from '../popupCreateButton/DateSetter';
import PrioritySelect from '../popupCreateButton/PrioritySelect';
import StatusSelect from '../popupCreateButton/StatusSelect';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PopupDeleteTaskIcon from './PopupDeleteTaskIcon';
import { selectedProjectSelector } from '../../store';

interface ITaskProps {
	id: string;
	name: string;
	columnId: string;
	columnName: string;
	description: string;
	startDate: Date | null;
	endDate: Date | null;
	deadline: Date | null;
	priority: string;
	isDaySpecific: boolean;
};

const truncatedDescriptionStyles = {
	display: '-webkit-box',
    '-webkit-line-clamp': '4',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
}

const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

export const TaskCard = (props: ITaskProps) => {
	const { id, name, columnId, columnName, description, startDate, endDate, deadline, priority, isDaySpecific } = props;
    const selectedProject = useSelector(selectedProjectSelector);
	const [open, setOpen] = useState(false);
	const [editingMode, setEditingMode] = useState(false);

	const nameReference: RefObject<HTMLInputElement> = useRef(null);
	const descriptionReference: RefObject<HTMLInputElement> = useRef(null);

	const [newColumnId, setNewColumnId] = useState(columnId);
	const [priorityCurrent, setPriorityCurrent] = useState(priority);
	const [deadlineCurrent, setDeadlineCurrent] = useState<Date | null>(deadline);
	const [startDateCurrent, setStartDateCurrent] = useState<Date | null>(startDate);
	const [endDateCurrent, setEndDateCurrent] = useState<Date | null>(endDate);
	const [isDaySpecificCurrent, setIsDaySpecificCurrent] = useState<boolean>(isDaySpecific);

	const handleClickOpen = (event: any): void => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = async (event: any): Promise<void> => {
		preventProjectSwitch(event);

		if (nameReference.current) {
			const task = {
				name: nameReference.current.value,
				description: descriptionReference.current !== null ? descriptionReference.current.value : '',
				priority: priorityCurrent as Priority,
				status: columnName,
				startDate: startDateCurrent,
				endDate: endDateCurrent,
				deadline: deadlineCurrent,
				isDaySpecific: isDaySpecificCurrent,
			};

			await editTask(selectedProject.id, columnId, id, task);
			if (columnId !== newColumnId) {
				switchTaskColumn(selectedProject.id, columnId, newColumnId, id)
			}

			handleExitEditingMode();
			setOpen(false);
		} else {
			alert('Missing required fields.');
		}
	};

	const handleCancelClose = (event: any): void => {
		preventProjectSwitch(event);
		handleExitEditingMode();
		setOpen(false);
	};

	const handleExitEditingMode = () => {
		setEditingMode(false);
	}

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};

	const EditDialog= (<>
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
				<Box marginTop="5px">
					<DateSetter value={deadlineCurrent} setValue={setDeadlineCurrent}/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleExitEditingMode}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Save</Button>
			</DialogActions>
		</>);

	const DetailsDialog = (<>
		<DialogTitle>
			<Grid container justifyContent="space-between">
				<span>Details of "{name}"</span>
				<Box sx={{cursor: 'pointer'}}>
					<EditOutlinedIcon onClick={() => setEditingMode(true)}/>
					<PopupDeleteTaskIcon name={ name } boardId={ selectedProject.id } columnId={ columnId } taskId={ id } />
				</Box>
			</Grid>

		</DialogTitle>
		<DialogContent className="form-content">
				<Typography variant="body2">{ description }</Typography>

				<Box marginTop="50px">
					Status: <Button variant="outlined">{ columnName }</Button>
				</Box>
				<Box marginTop="10px">
					Priority: <TripOriginIcon sx={{ color: PriorityColor[priority as Priority] }} /> { priority }
				</Box>
				<Box marginTop="10px">
					Deadline: { deadline ? (<Button size="small">{ deadline.toLocaleDateString("en-US", dateOptions) }</Button>) : 'Not set' }
				</Box>
		</DialogContent>
		<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
		</DialogActions>
	</>);

    return (
		<>
			<Card className="task-card hoverable" variant="outlined" onClick={ handleClickOpen }>
				<CardContent>
					<Typography variant="h6" component="div">{ name }</Typography>
					<Typography variant="body2" sx={truncatedDescriptionStyles}>{ description }</Typography>
				</CardContent>
				<CardActions>
					<Tooltip title={priority}>
						<TripOriginIcon sx={{ color: PriorityColor[priority as Priority] }} className="icon"/>
					</Tooltip>
					{deadline && (<>Due: <Button size="small">{ deadline.toLocaleDateString("en-US", dateOptions) }</Button></>)}
				</CardActions>
			</Card>
			<Dialog
			open={open}
			onClose={preventProjectSwitch}
			onClick={preventProjectSwitch}
			fullWidth={true}
			maxWidth="sm"
			>
				{editingMode ? EditDialog : DetailsDialog}
			</Dialog>
		</>
    );
};
