import { ReactNode, useState } from 'react';
import {
	Button,
	Card,
	CardContent,
	CardActions,
	Dialog,
	Tooltip,
	Typography,
} from '@mui/material';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { ITaskProps, Priority, PriorityColor } from '../types';
import { dateTimeOptions, truncatedDescriptionStyles } from '../../utils/constants';
import { DetailsDialog } from './DetailsDialog';
import { EditDialog } from './EditDialog';

interface ITaskCardProps {
	task: ITaskProps;
	isGridView?: boolean;
};

export const TaskCard = ({ task, isGridView = true }: ITaskCardProps) => {
	const { name, columnName = '', description, deadline, priority, completed } = task;
	const [open, setOpen] = useState(false);
	const [editingMode, setEditingMode] = useState(false);

	const handleClickOpen = (event: any): void => {
		preventProjectSwitch(event);
		setOpen(true);
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

	const taskName = (completed ? <span style={{textDecoration: 'line-through'}}>{name}</span> : <span>{name}</span>) as ReactNode;

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
				{editingMode
					? (<EditDialog
						task={task}
						handleCancelClose={handleExitEditingMode}
					/>)
					: (<DetailsDialog
						task={task}
						taskNameFormatted={taskName}
						setEditingMode={setEditingMode}
						handleCancelClose={handleCancelClose}
					/>)
				}
			</Dialog>
		</>
    );
};
