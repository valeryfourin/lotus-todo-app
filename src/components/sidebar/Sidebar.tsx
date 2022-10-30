import { Icon } from 'react-materialize';
import { useDispatch } from 'react-redux';
import { Header } from '../header';
import { logout } from '../store';
import { NavDropdown } from './NavDropdown';
import './Sidebar.css';

export const Sidebar = (): JSX.Element => {
    const dispatch = useDispatch();
    return (
        <div className='sidebar'>
            <Header />
            <div className='sidebar__nav'>
                <div><Icon className="icon">home</Icon>Overview</div>
                <div><Icon className="icon">equalizer</Icon>Stats</div>
                <div><Icon className="icon">folder_open</Icon>
                    <NavDropdown />
                </div>
                
                <div onClick={() => dispatch(logout())}><Icon className="icon">exit_to_app</Icon>Sign out</div>
            </div>
        </div>
        );
};