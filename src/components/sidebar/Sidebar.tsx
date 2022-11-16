import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button } from '@mui/material';
import { HOME_ROUTE } from '../../utils/constants';
import { Header } from '../header';
import { logout } from '../store';
import { EntityDropdown } from './EntityDropdown';

import './Sidebar.css';

export const Sidebar = (): JSX.Element => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

	const logoutHandler = (): void => {
		dispatch(logout());
		navigate(HOME_ROUTE);
	};

    return (
        <div className='sidebar'>
            <Header />
            <div className='sidebar__nav'>
                <div onClick={() => navigate(HOME_ROUTE)}>
                    <HomeOutlinedIcon className="icon"/>
                    <Button variant="text">Overview</Button>
                </div>
                <div>
                    <BarChartOutlinedIcon className="icon"/>
                    <Button variant="text">Stats</Button>
                </div>
                <div>
                    <FolderOpenOutlinedIcon className="icon"/>
                    <EntityDropdown />
                </div>

                <div className="sidebar__nav--last" >
                    <LogoutOutlinedIcon className="icon"/>
                    <Button variant="text" onClick={logoutHandler}>Sign out</Button>
                </div>
            </div>
        </div>
	);
};
