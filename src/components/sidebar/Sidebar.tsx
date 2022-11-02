import { useDispatch } from 'react-redux';
import { Header } from '../header';
import { logout } from '../store';
import { NavDropdown } from './NavDropdown';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import './Sidebar.css';
import { Button } from '@mui/material';

export const Sidebar = (): JSX.Element => {
    const dispatch = useDispatch();
    return (
        <div className='sidebar'>
            <Header />
            <div className='sidebar__nav'>
                <div>
                    <HomeOutlinedIcon className="icon"/>
                    <Button variant="text">Overview</Button>
                </div>
                <div>
                    <BarChartOutlinedIcon className="icon"/>
                    <Button variant="text">Stats</Button>
                </div>
                <div>
                    <FolderOpenOutlinedIcon className="icon"/>
                    <NavDropdown />
                </div>
                
                <div className="sidebar__nav--last" >
                    <LogoutOutlinedIcon className="icon"/>
                    <Button variant="text" onClick={() => dispatch(logout())}>Sign out</Button>
                </div>
            </div>
        </div>
        );
};