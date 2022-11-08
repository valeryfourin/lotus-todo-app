import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { selectedProjectSelector, userSelector } from '../store';
import './BoardNavbar.css';

export const BoardNavbar = (): JSX.Element => {
    const user = useSelector(userSelector);
    const selectedProject = useSelector(selectedProjectSelector);

    return (
        <div className="board-navbar">
            <div className="board-header">
                <div >
                    <span className="project-name">{selectedProject.name}</span>
                    <Button className="create-button" variant="outlined" endIcon={<AddIcon />} sx={{margin: '0px 0px 12px 20px'}}>
                        Create task
                    </Button>
                </div>
                <div className="user">
                    <AccountCircleOutlinedIcon/>
                    <span>Hi, {user?.email ?? 'user'}!</span>
                </div>
            </div>
        </div>
    );
};