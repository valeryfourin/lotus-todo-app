import { RefObject, useState, useRef } from 'react';
import { IconButton, Dialog, TextField, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ActionType, IPopupIcon } from '../types';
import { executeBoardRequest, executeColumnRequest, getBoardsNames, getColumnsNames, getPopupTitle } from './utils';

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
	const [open, setOpen] = useState(false);
	const [hasInputError, setHasInputError] = useState(false);
	const nameReference: RefObject<HTMLInputElement> = useRef(null);

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

	const preventProjectSwitch = (event: any): void => {
		event.stopPropagation()
	};

	const handleInputError = async (event: any) => {
		let entitiesNames = [];
		if (entity === 'board') {
			entitiesNames = await getBoardsNames();
		} else {
			entitiesNames = await getColumnsNames(props.boardId);
		}
		const isNameDuplicate = (entitiesNames && nameReference.current && entitiesNames.includes(nameReference.current?.value)) ?? false;
		setHasInputError(isNameDuplicate);
	};

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
					error={hasInputError}
					helperText={hasInputError ? `A ${entity} with this name already exists.` : null}
					inputRef={nameReference}
					autoFocus
					margin="dense"
					id="name"
					label="Enter name"
					type="text"
					fullWidth
					variant="standard"
					onKeyDown={preventProjectSwitch}
					onChange={handleInputError}
				/>
				: null }
			</DialogContent>
			<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
			<Button onClick={handleConfirmClose} disabled={hasInputError}>Confirm</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
