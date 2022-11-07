import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";

import { authUser, firestore } from '../../firebase';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import PopupButton from './PopupButton';
import { addBoard, deleteBoard, editBoard } from '../../services/firestore';
import { PROJECT_ROUTE } from '../../utils/constants';

export const NavDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [boards, loading, error] = useCollection(
    collection(firestore, `users/${authUser.currentUser?.uid}/boards`)); 
    
  return (
    <div className="projects custom-scroll">
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Projects
      </Button>
      <PopupButton actionType="add" entity="board" color="secondary" handleAction={addBoard} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        className="custom-scroll"
        sx={{maxHeight: '300px'}}
      >
        {boards !== undefined && boards?.docs ? boards.docs.map((doc: any) => 
          (
            <MenuItem key={doc.id} className="dropdown-item" onClick={() => navigate(PROJECT_ROUTE + '/' + doc.id)} >
              <Grid
                container
                direction="row"
                justifyContent="space-between"
              >
                <span className="dropdown-item__name">{doc.data().name}</span>
                <div>
                  <PopupButton actionType="edit" entity="board" entityId={doc.id} handleAction={editBoard} color="secondary" />
                  <PopupButton actionType="delete" entity="board" entityId={doc.id} handleAction={deleteBoard} color="secondary" />
                </div>
              </Grid>
            </MenuItem>
          )
        ) : <span className="info-message">No projects yet. Start by creating a new one.</span>}
      
      </Menu>
    </div>
  );
}