import { useState, SyntheticEvent } from 'react';
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { preventProjectSwitch } from '../../../utils/helpers';

interface IConfirmDialogProps {
	title: string;
	message: string;
	onConfirm: () => void;
	icon?: JSX.Element;
}

export default function ConfirmDialog({title, message, onConfirm, icon}: IConfirmDialogProps) {
	const [open, setOpen] = useState(false);

	const handleClickOpen = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		onConfirm();
		setOpen(false);
	};

	const handleCancelClose = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setOpen(false);
	};

	return (
    <>
		<Button className="create-button" variant="outlined" {...(icon && {endIcon: icon})} onClick={handleClickOpen} sx={{marginRight: '10px'}}>
			{title}
		</Button>
		<Dialog open={open} onClose={preventProjectSwitch} onClick={preventProjectSwitch} fullWidth={true} maxWidth="sm">
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancelClose}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Confirm</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
