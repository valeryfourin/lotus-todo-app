import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from 'react-redux';
import { selectedProjectSelector, userSelector } from '../store';
import './BoardNavbar.css';
import { PopupCreateButton } from './project/popupCreateButton/PopupCreateButton';

export const BoardNavbar = (): JSX.Element => {
	const user = useSelector(userSelector);
	const selectedProject = useSelector(selectedProjectSelector);

	return (
		<div className="board-navbar">
			<div className="board-header">
				<div>
					<span className="project-name">{selectedProject.name}</span>
					<PopupCreateButton />
				</div>
				<div className="user">
					<AccountCircleOutlinedIcon/>
					<span>Hi, {user?.email ?? 'user'}!</span>
				</div>
			</div>
		</div>
	);
};
