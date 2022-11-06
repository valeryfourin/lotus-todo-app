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

type ActionType = 'add' | 'edit' | 'delete';
type Entity = 'board' | 'column';

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

const getPopupTitle = (entity: Entity, action: ActionType) => {
  switch (action) {
    case 'add':
      return `Create new ${entity}`;
    case 'edit':
      return `Edit ${entity}`;
    case 'delete':
      return `Delete ${entity}`;
    default: 
      return '';
  }
}

export default function  PopupButton({actionType, entity, handleAction, entityId, styles={}}: any) {
  const [open, setOpen] = React.useState(false);
  const nameReference: React.RefObject<any> = React.useRef();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleConfirmClose = () => {
      if (actionType === 'add') {
        if (nameReference.current) {
          handleAction(nameReference.current.value);
        }
      } else if (actionType === 'edit') {
        if (nameReference.current) {
          handleAction(entityId, nameReference.current.value);
        }
      } else if (actionType === 'delete') {
        handleAction(entityId);
      }
    setOpen(false);
  };

  const handleCancelClose = () => {
    setOpen(false);
  }

  return (
    <>
      <IconButton color="primary" aria-label="add" onClick={handleClickOpen} sx={styles}>
        {getIconFromActionType(actionType)}
      </IconButton>
      <Dialog open={open}  fullWidth={true} maxWidth="sm">
        <DialogTitle>{getPopupTitle(entity, actionType)}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType !== 'delete' 
              ? `Please enter new name for the ${entity}:`
              : `Are you sure you want to delete this ${entity}?`}          
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
