import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { userSelector } from '../store';
import './BoardNavbar.css';
import { useParams } from 'react-router-dom';

export const BoardNavbar = (): JSX.Element => {
    const user = useSelector(userSelector);
    const {id} = useParams();
    return (
        <div className="board-navbar">
            <div className="board-header">
                <div >
                    <span className="project-name">{id}</span>
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