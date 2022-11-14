import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TripOriginIcon  from '@mui/icons-material/TripOrigin';
import { Priority, PriorityColor } from '../../../types';
import { editTask } from '../../../../services/firestore/taskService';
import { useSelector } from 'react-redux';
import { selectedProjectSelector } from '../../../store';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip } from '@mui/material';
import { RefObject, useRef, useState } from 'react';
import DateSetter from '../popupCreateButton/DateSetter';
import PrioritySelect from '../popupCreateButton/PrioritySelect';
import StatusSelect from '../popupCreateButton/StatusSelect';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PopupDeleteTaskIcon from './PopupDeleteTaskIcon';

interface ITaskProps {
	id: string;
	name: string;
	columnId: string;
	columnName: string;
	description: string;
	deadline: Date | null;
	priority: string;
};

export const TaskCard = ({ id, name, columnId, columnName, description, deadline, priority }: ITaskProps) => {
    const selectedProject = useSelector(selectedProjectSelector);
	const [open, setOpen] = useState(false);
	const [editingMode, setEditingMode] = useState(false);

	const nameReference: RefObject<HTMLInputElement> = useRef(null);
	const descriptionReference: RefObject<HTMLInputElement> = useRef(null);

	const [statusCurrent, setStatus] = useState(columnName);
	const [priorityCurrent, setPriority] = useState(priority);
	const [deadlineCurrent, setDeadline] = useState<Date | null>(deadline);

	const handleClick = (event: any): void => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: any): void => {
		preventProjectSwitch(event);

		if (nameReference.current) {
			const task = {
				name: nameReference.current.value,
				description: descriptionReference.current !== null ? descriptionReference.current.value : '',
				priorityCurrent,
				statusCurrent,
				deadlineCurrent,
			};
			console.log(task);

			editTask(selectedProject.id, columnName, id, task); //change columnName to columnId after cleaning DB
			// resetState();
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

	const handleEnterEditingMode = () => {
		setEditingMode(true);
	}

	const handleExitEditingMode = () => {
		setEditingMode(false);
	}

	const handleDelete = () => {

	}

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};
	const resetState = (): void => {
		setStatus('');
		setPriority(Priority.notSet);
		setDeadline(null);
	};

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
						<PrioritySelect value={priorityCurrent} setValue={setPriority}/>
					</Grid>
					<Grid item xs>
						<StatusSelect value={statusCurrent} setValue={setStatus} />
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
					<DateSetter value={deadlineCurrent} setValue={setDeadline}/>
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
				<div>
					<EditOutlinedIcon onClick={() => setEditingMode(true)}/>
					<PopupDeleteTaskIcon name={ name } boardId={ selectedProject.id } columnId={ columnName } taskId={ id } />
				</div>
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
					Deadline: { deadline ? (<Button size="small">{ deadline.toDateString() }</Button>) : 'Not set' }
				</Box>
		</DialogContent>
		<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
			{/* <Button onClick={handleConfirmClose}>Save</Button> */}
		</DialogActions>
	</>);

    return (
		<>
			<Card className="task-card hoverable" variant="outlined" onClick={ handleClick }>
				<CardContent>
					<Typography variant="h6" component="div">{ name }</Typography>
					<Typography variant="body2">{ description }</Typography>
				</CardContent>
				<CardActions>
					<Tooltip title={priority}>
						<TripOriginIcon sx={{ color: PriorityColor[priority as Priority] }} className="icon"/>
					</Tooltip>
					{deadline && (<>Due: <Button size="small">{ deadline.toDateString() }</Button></>)}
					{/* <Typography variant="body2" color={PriorityColor[priority as Priority]}>{priority}</Typography> */}
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
