import { ReactNode, RefObject, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { ITaskProps, Priority, PriorityColor } from '../types';
import { editTask, setTaskCompleted, setTaskScheduled } from '../../services/firestore/taskService';
import DateSetter from '../dashboard/popupCreateButton/DateSetter';
import PrioritySelect from '../dashboard/popupCreateButton/PrioritySelect';
import StatusSelect from '../dashboard/popupCreateButton/StatusSelect';
import { selectedProjectSelector } from '../store';
import DateTimeSetter from '../dashboard/popupCreateButton/DateTimeSetter';
import { dateTimeOptions, truncatedDescriptionStyles } from '../../utils/constants';
import { DetailsDialog } from './DetailsDialog';

interface ITaskCardProps {
	task: ITaskProps;
	isGridView?: boolean;
};

export const TaskCard = ({ task, isGridView = true }: ITaskCardProps) => {
	const { id, name, columnId, columnName = '', description, startDate, endDate, deadline, priority, isDaySpecific, isScheduled, completed, completeDate } = task;
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
	const [isScheduledCurrent, setIsScheduledCurrent] = useState<boolean>(isScheduled);

	const handleClickOpen = (event: any): void => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = async (event: any): Promise<void> => {
		preventProjectSwitch(event);

		if (startDateCurrent && endDateCurrent && startDateCurrent.getTime() >= endDateCurrent.getTime()) {
			alert('Task cannot end before starting!');
			return;
		} else if (isDaySpecificCurrent
			&& startDateCurrent
			&& endDateCurrent
			&& deadlineCurrent
			&& (deadlineCurrent.getTime() < endDateCurrent.getTime() || deadlineCurrent.getTime() <= startDateCurrent.getTime())) {
				alert('Task cannot have deadline defore end or start!');
				return;
		}

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
		setTaskCompleted(selectedProject.id, id, !completed);
	}

	const toggleScheduled = (isScheduled: boolean) => {
		setTaskScheduled(selectedProject.id, id, isScheduled);
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
				<Box marginTop="15px">
					<DateSetter value={deadlineCurrent} setValue={setDeadlineCurrent}/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleExitEditingMode}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Save</Button>
			</DialogActions>
		</>);

	const taskName = (completed ? <span style={{textDecoration: 'line-through'}}>{name}</span> : <span>{name}</span>) as ReactNode;

	// const DetailsDialog = (<>
	// 	<DialogTitle>
	// 		<Grid container justifyContent="space-between">
	// 			<span>Details of "{taskName}"</span>
	// 			<Box sx={{cursor: 'pointer'}}>
	// 				<EditOutlinedIcon onClick={() => setEditingMode(true)}/>
	// 				<PopupDeleteTaskIcon name={ name } boardId={ selectedProject.id } taskId={ id } />
	// 				<DoneOutlineIcon onClick={toggleTaskDone}/>
	// 			</Box>
	// 		</Grid>

	// 	</DialogTitle>
	// 	<DialogContent className="form-content">
	// 			<Typography variant="body2">{ description }</Typography>

	// 			<Box marginTop="50px">
	// 				Status: <Button variant="outlined">{ columnName }</Button>
	// 			</Box>
	// 			<Box marginTop="10px">
	// 				Priority: <TripOriginIcon sx={{ color: PriorityColor[priority as Priority], verticalAlign: 'middle' }} /> { priority }
	// 			</Box>
	// 			<Box marginTop="10px">
	// 				Start: { startDate ? (
	// 				<Button size="small">
	// 					{isDaySpecific
	// 						? startDate.toLocaleDateString("en-US", dateTimeOptions)
	// 						: startDate.toLocaleTimeString("en-US", timeOptions)}
	// 				</Button>) : 'Not set' }
	// 			</Box>
	// 			<Box marginTop="10px">
	// 				End: { endDate ? (
	// 				<Button size="small">
	// 					{isDaySpecific
	// 						? endDate.toLocaleDateString("en-US", dateTimeOptions)
	// 						: endDate.toLocaleTimeString("en-US", timeOptions)}
	// 				</Button>) : 'Not set' }
	// 			</Box>
	// 			<Box marginTop="10px">
	// 				Deadline: { deadline ? (<Button size="small">{deadline.toLocaleDateString("en-US", dateTimeOptions)}</Button>) : 'Not set' }
	// 			</Box>
	// 			<Box marginTop="10px">
	// 				Completed: { completeDate ? (<Button size="small">{completeDate.toLocaleDateString("en-US", dateTimeOptions)}</Button>) : 'Not yet completed' }
	// 			</Box>

	// 			{ !completed && (
	// 				<FormControlLabel control={
	// 					<Checkbox checked={isScheduledCurrent} onChange={(event) => toggleScheduled(event.target.checked)} />
	// 					} label="Include in schedule" />
	// 			)}
	// 	</DialogContent>
	// 	<DialogActions>
	// 		<Button onClick={handleCancelClose}>Cancel</Button>
	// 	</DialogActions>
	// </>);

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
				{deadline && (<>Due: <Button size="small">{ deadline.toLocaleDateString("en-US", dateTimeOptions) }</Button></>)}
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
					{deadline && (<Button size="small">{ deadline.toLocaleDateString("en-US", dateTimeOptions) }</Button>)}
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
				{editingMode ? EditDialog
					: (<DetailsDialog
						// id={id}
						// name={name}
						task={task}
						taskNameFormatted={taskName}
						// description={description}
						// columnName={columnName}
						// priority={priority}
						// startDate={startDate}
						// endDate={endDate}
						// deadline={deadline}
						// completed={completed}
						// completeDate={completeDate}
						// isDaySpecific={isDaySpecific}
						// isScheduled={isScheduled}
						setEditingMode={setEditingMode}
						handleCancelClose={handleCancelClose}
						toggleTaskDone={toggleTaskDone}
						toggleScheduled={toggleScheduled}
					/>)}
			</Dialog>
		</>
    );
};