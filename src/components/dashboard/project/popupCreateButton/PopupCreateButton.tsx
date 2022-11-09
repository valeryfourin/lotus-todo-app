import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRef, useState } from 'react';
import PrioritySelect from './PrioritySelect';
import './PopupCreateButton.css';

export const PopupCreateButton = (): JSX.Element => {
	// const {actionType, entity, styles={}} = props;
	const [open, setOpen] = useState(false);
	const nameReference: React.RefObject<any> = useRef();

	const handleClickOpen = (event: any) => {
		preventProjectSwitch(event);
		setOpen(true);
	};

	const handleConfirmClose = (event: any) => {
		preventProjectSwitch(event);

		setOpen(false);
	};

	const handleCancelClose = (event: any) => {
		preventProjectSwitch(event);
		setOpen(false);
	}

	const preventProjectSwitch = (event: any): void => {event.stopPropagation()};

	return (
    <>
		<Button className="create-button" variant="outlined" endIcon={<AddIcon />} onClick={handleClickOpen} sx={{margin: '0px 0px 12px 20px'}}>
			Create task
		</Button>
		<Dialog open={open} onClose={preventProjectSwitch} onClick={preventProjectSwitch} fullWidth={true} maxWidth="sm">
			<DialogTitle>Create new task</DialogTitle>
			<DialogContent>
				<TextField
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
				<PrioritySelect />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancelClose}>Cancel</Button>
				<Button onClick={handleConfirmClose}>Create</Button>
			</DialogActions>
		</Dialog>
    </>
  );
}
