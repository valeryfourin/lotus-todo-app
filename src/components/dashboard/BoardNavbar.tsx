import { Divider } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from 'react-redux';
import { userSelector } from '../store';
import './BoardNavbar.css';
import ViewTabs from './ViewTabs';

export const BoardNavbar = (): JSX.Element => {
    const user = useSelector(userSelector);
    return (
        <div className="board-navbar">
            <div className="board-header">
                <div className='project-name'>
                    My project
                </div>
                <div className='user'>
                    <AccountCircleOutlinedIcon/>
                    <span>Hi, {user?.email ?? 'user'}!</span>
                </div>
            </div>
        </div>
    );
};