import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { IconButton } from '@mui/material';
import { ActionType, IPopupIcon } from '../types';
import { executeBoardRequest, executeColumnRequest, getPopupTitle } from './utils';

const getIconFromActionType = (action: ActionType) => {
  switch (action) {
    case 'add':
      return <AddIcon />;
    case 'edit':
      return <EditOutlinedIcon />;
    case 'delete':
      return <DeleteOutlinedIcon />;
    default:
      return null;
  }
}

export default function PopupIcon(props: IPopupIcon) {
	const {actionType, entity, styles={}} = props;
	const [open, setOpen] = React.useState(false);
	const nameReference: React.RefObject<any> = React.useRef();

	const handleClickOpen = (event: any) => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: any) => {
		preventProjectSwitch(event);

		if (entity === 'board') {
			executeBoardRequest(actionType, props.boardId, nameReference);
		} else if (entity === 'column') {
			executeColumnRequest(actionType, props.boardId, props.columnId, nameReference);
		}

		setOpen(false);
	};

	const handleCancelClose = (event: any) => {
		preventProjectSwitch(event);
		setOpen(false);
	}

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};

	return (
    <>
		<IconButton color="primary" aria-label="add" onClick={handleClickOpen} sx={styles}>
			{getIconFromActionType(actionType)}
		</IconButton>
		<Dialog open={open} onClose={preventProjectSwitch} onClick={preventProjectSwitch} fullWidth={true} maxWidth="sm">
			<DialogTitle>{getPopupTitle(entity, actionType)}</DialogTitle>
			<DialogContent>
			<DialogContentText>
				{actionType !== 'delete'
				? `Please enter new name for the ${entity}:`
				: `Are you sure you want to delete this ${entity}? It's irreversible.`}
			</DialogContentText>
			{actionType !== 'delete'
				? <TextField
					inputRef={nameReference}
					autoFocus
					margin="dense"
					id="name"
					label="Enter name"
					type="text"
					fullWidth
					variant="standard"
					onKeyDown={preventProjectSwitch}
				/>
				: null }
			</DialogContent>
			<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
			<Button onClick={handleConfirmClose}>Confirm</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
