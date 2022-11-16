import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../store';
import { Avatar, Divider } from '@mui/material';

import './BoardNavbar.css';

interface IBoardNavbar {
	title: string
}

export const BoardNavbar = (props: React.PropsWithChildren<IBoardNavbar>): JSX.Element => {
	const user = useSelector(userSelector);
	const userEmail = useMemo(() => user?.email ?? 'user', [user]);
	const userEmailFirstLetter = userEmail.split('')[0];

	return ( <>
		<div className="board-navbar">
			<div className="board-header">
				<div>
					<span className="page-title">{props.title}</span>
					{props.children}
				</div>
				<div className="user">
					<span>Hi, {userEmail}!</span>
					<Avatar className="hoverable" sx={{ bgcolor: 'lightblue', marginLeft: '10px' }}>{userEmailFirstLetter}</Avatar>
				</div>
			</div>
		</div>
		<Divider />
	</>
	);
};
