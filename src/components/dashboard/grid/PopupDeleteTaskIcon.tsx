import { SyntheticEvent, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { deleteTask } from '../../../services/firestore/taskService';
import { preventProjectSwitch } from '../../../utils/helpers';

interface IPopupDeleteTaskIcon {
	name: string;
	boardId: string;
	taskId: string;
}

export default function PopupDeleteTaskIcon(props: IPopupDeleteTaskIcon) {
	const {name, boardId, taskId} = props;
	const [open, setOpen] = useState(false);

	const handleClickOpen = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		deleteTask(boardId, taskId);
		setOpen(false);
	};

	const handleCancelClose = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setOpen(false);
	}

	return (
    <>
		<DeleteOutlinedIcon onClick={handleClickOpen}/>
		<Dialog open={open} onClose={preventProjectSwitch} onClick={preventProjectSwitch} fullWidth={true} maxWidth="sm">
			<DialogTitle>Delete task "{name}"</DialogTitle>
			<DialogContent>
			<DialogContentText>
				Are you sure you want to delete this task? It's irreversible.
			</DialogContentText>
			</DialogContent>
			<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
			<Button onClick={handleConfirmClose}>Confirm</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
