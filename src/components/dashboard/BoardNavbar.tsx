import { useSelector } from 'react-redux';
import { selectedProjectSelector, userSelector } from '../store';
import { PopupCreateButton } from './popupCreateButton/PopupCreateButton';
import './BoardNavbar.css';
import { Avatar } from '@mui/material';
import { useMemo } from 'react';

export const BoardNavbar = (): JSX.Element => {
	const user = useSelector(userSelector);
	const selectedProject = useSelector(selectedProjectSelector);
	const userName = useMemo(() => user?.email ?? 'user', [user]);
	const userNameFirstLetter = userName.split('')[0][0];

	return (
		<div className="board-navbar">
			<div className="board-header">
				<div>
					<span className="page-title">{selectedProject.name}</span>
					<PopupCreateButton />
				</div>
				<div className="user">
					<span>Hi, {userName}!</span>
					<Avatar className="hoverable" sx={{ bgcolor: 'lightblue', marginLeft: '10px' }}>{userNameFirstLetter}</Avatar>
				</div>
			</div>
		</div>
	);
};
