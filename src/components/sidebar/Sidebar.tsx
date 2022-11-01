import { useDispatch } from 'react-redux';
import { Header } from '../header';
import { logout } from '../store';
import { NavDropdown } from './NavDropdown';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import './Sidebar.css';

export const Sidebar = (): JSX.Element => {
    const dispatch = useDispatch();
    return (
        <div className='sidebar'>
            <Header />
            <div className='sidebar__nav'>
                <div><HomeOutlinedIcon className="icon"/>Overview</div>
                <div><BarChartOutlinedIcon className="icon"/>Stats</div>
                <div><FolderOpenOutlinedIcon className="icon"/>
                    <NavDropdown />
                </div>
                
                <div className="sidebar__nav--last" onClick={() => dispatch(logout())}><LogoutOutlinedIcon className="icon"/>Sign out</div>
            </div>
        </div>
        );
};