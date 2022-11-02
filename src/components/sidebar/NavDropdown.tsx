import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Grid, IconButton } from '@mui/material';

const projects = ['board1', 'travel', 'app'];

export const NavDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Projects
      </Button>
      <IconButton color="secondary" aria-label="add"><AddIcon/></IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {projects && projects.map((name: string) => 
          (
            <MenuItem key={name} onClick={handleClose} className="dropdown-item">
              <Grid
                container
                direction="row"
                justifyContent="space-between"
              >
                <span>{name}</span>
                <div>
                  <IconButton color="secondary" aria-label="add"><EditOutlinedIcon/></IconButton>
                  <IconButton color="secondary" aria-label="add"><DeleteOutlinedIcon/></IconButton>
                </div>
              </Grid>
              
              
            </MenuItem>
          )
        )}
      
      </Menu>
    </div>
  );
}