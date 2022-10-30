import { Icon } from 'react-materialize';
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
                    <Icon className='user-icon'>account_circle</Icon>
                    <span>Hi, {user?.email ?? 'user'}!</span>
                </div>
            </div>
            <div className="board-views">
                <ViewTabs/>
            </div>
        </div>
    );
};