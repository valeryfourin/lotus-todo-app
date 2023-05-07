import { ReactNode, RefObject, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TripOriginIcon  from '@mui/icons-material/TripOrigin';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip } from '@mui/material';
import { Priority, PriorityColor } from '../../types';
import { editTask, setTaskCompleted } from '../../../services/firestore/taskService';
import DateSetter from '../popupCreateButton/DateSetter';
import PrioritySelect from '../popupCreateButton/PrioritySelect';
import StatusSelect from '../popupCreateButton/StatusSelect';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PopupDeleteTaskIcon from './PopupDeleteTaskIcon';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { selectedProjectSelector } from '../../store';

interface ITaskProps {
	id: string;
	name: string;
	columnId: string;
	columnName?: string;
	description: string;
	startDate: Date | null;
	endDate: Date | null;
	deadline: Date | null;
	priority: string;
	isDaySpecific: boolean;
	completed: boolean;
	completeDate?: Date;
	isGridView?: boolean;
};

const truncatedDescriptionStyles = {
	display: '-webkit-box',
    '-webkit-line-clamp': '4',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
	maxWidth: 400,
};

const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

export const TaskCard = (props: ITaskProps) => {
	const { id, name, columnId, columnName = '', description, startDate, endDate, deadline, priority, isDaySpecific, completed, completeDate, isGridView = true } = props;
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
	const [completedCurrent, setCompletedCurrent] = useState<boolean>(completed);

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
				columnId: newColumnId,
				startDate: startDateCurrent,
				endDate: endDateCurrent,
				deadline: deadlineCurrent,
				isDaySpecific: isDaySpecificCurrent,
			};

			await editTask(selectedProject.id, id, task);

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

	const toggleTaskDone = () => {
		setCompletedCurrent(!Boolean(completed));
		setTaskCompleted(selectedProject.id, id, !completed);
	}

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};

	const EditDialog = (<>
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

	const taskName = (completed ? <span style={{textDecoration: 'line-through'}}>{name}</span> : <span>{name}</span>) as ReactNode;

	const DetailsDialog = (<>
		<DialogTitle>
			<Grid container justifyContent="space-between">
				<span>Details of "{taskName}"</span>
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
					Deadline: { deadline ? (<Button size="small">{ deadline.toLocaleDateString("en-US", dateOptions) }</Button>) : 'Not set' }
				</Box>
				{completeDate && (
					<Box marginTop="10px">
						Completed: <Button size="small">{ completeDate.toLocaleDateString("en-US", dateOptions) }</Button>
					</Box>
				)}

		</DialogContent>
		<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
		</DialogActions>
	</>);

	const GridItem = (
		<Card className="task-card hoverable" variant="outlined" onClick={ handleClickOpen }>
			<CardContent>
				<Typography variant="h6" component="div">{ taskName }</Typography>
				<Typography variant="body2" sx={truncatedDescriptionStyles}>{ description }</Typography>
			</CardContent>
			<CardActions>
				<Tooltip title={priority}>
					<TripOriginIcon sx={{ color: PriorityColor[priority as Priority] }} className="icon"/>
				</Tooltip>
				{deadline && (<>Due: <Button size="small">{ deadline.toLocaleDateString("en-US", dateOptions) }</Button></>)}
				{/* {completeDate && (<>Completed: <Button size="small">{ completeDate.toLocaleDateString("en-US", dateOptions) }</Button></>)} */}
			</CardActions>
		</Card>
	);

	const ListItem = (
		<Card className="list-item hoverable" variant="outlined" onClick={ handleClickOpen }>
			<CardContent sx={{ display: 'flex', alignItems: 'center' }} >
				<div className="column-title column-40">
					<Typography variant="h6" component="div">{ taskName }</Typography>
					<Typography variant="body2" sx={{...truncatedDescriptionStyles, '-webkit-line-clamp': '2'}}>{ description }</Typography>
				</div>
				<div className="column-title column-25">
					{deadline && (<Button size="small">{ deadline.toLocaleDateString("en-US", dateOptions) }</Button>)}
				</div>
				<div className="column-20">
					<TripOriginIcon sx={{ color: PriorityColor[priority as Priority], verticalAlign: 'middle' }} /> { priority }
				</div>
				<div>
					<Button variant="outlined">{ columnName }</Button>
				</div>
			</CardContent>
		</Card>
	);

    return (
		<>
			{isGridView ? GridItem : ListItem}
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
