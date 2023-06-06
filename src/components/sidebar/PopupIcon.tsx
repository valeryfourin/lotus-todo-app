import { RefObject, useState, useRef, SyntheticEvent } from 'react';
import { IconButton, Dialog, TextField, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ActionType, IPopupIcon } from '../types';
import { executeBoardRequest, executeColumnRequest, getBoardsNames, getColumnsNames, getPopupTitle } from './utils';
import { preventProjectSwitch } from '../../utils/helpers';
import { titleMissingMessage } from '../../utils/constants';

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

const defaultErrorState = {
	missingName: false,
	duplicateName: false,
};

export default function PopupIcon(props: IPopupIcon) {
	const {actionType, entity, styles={}} = props;
	const [open, setOpen] = useState(false);
	const nameReference: RefObject<HTMLInputElement> = useRef(null);

	const [inputError, setInputError] = useState(defaultErrorState);

	const handleClickOpen = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setInputError(defaultErrorState);

		if (!nameReference.current?.value && actionType !== 'delete') {
			return setInputError({...inputError, missingName: true});
		}

		if (entity === 'board') {
			executeBoardRequest(actionType, props.boardId, nameReference);
		} else if (entity === 'column') {
			executeColumnRequest(actionType, props.boardId, props.columnId, nameReference);
		}

		setOpen(false);
	};

	const handleCancelClose = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setOpen(false);
	}

	const handleInputError = async () => {
		let entitiesNames = [];
		if (entity === 'board') {
			entitiesNames = await getBoardsNames();
		} else {
			entitiesNames = await getColumnsNames(props.boardId);
		}
		const isNameDuplicate = (entitiesNames && nameReference.current && entitiesNames.includes(nameReference.current?.value)) ?? false;

		setInputError({...inputError, duplicateName: isNameDuplicate});
	};

	const hasInputError = (inputError.missingName || inputError.duplicateName) && actionType !== 'delete';

	const showInputError = (): string => {
		if (inputError.missingName) {
			return titleMissingMessage;
		} else if (inputError.duplicateName) {
			return `A ${entity} with this name already exists.`;
		} else {
			return '';
		}
	};

	const handleOnKeyDown = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setInputError(defaultErrorState);
	};

	return (<>
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
					helperText={showInputError()}
					inputRef={nameReference}
					autoFocus
					margin="dense"
					id="name"
					label="Enter name"
					type="text"
					fullWidth
					variant="standard"
					onKeyDown={handleOnKeyDown}
					onChange={handleInputError}
					required
				/>
				: null }
			</DialogContent>
			<DialogActions>
			<Button onClick={handleCancelClose}>Cancel</Button>
			<Button onClick={handleConfirmClose} disabled={hasInputError}>Confirm</Button>
			</DialogActions>
		</Dialog>
    </>);
}
