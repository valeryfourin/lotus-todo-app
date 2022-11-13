import { MouseEvent, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { authUser, firestore } from '../../firebase';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import PopupIcon from './PopupIcon';
import { PROJECT_ROUTE } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { changeSelectedProject } from '../store';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

export const EntityDropdown = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [boards] = useCollection(collection(firestore, `users/${authUser.currentUser?.uid}/boards`));

	const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget) };
	const handleClose = () => { setAnchorEl(null) };
	const handleItemClick = (doc:any) => {
		dispatch(changeSelectedProject({id: doc.id, name: doc.data().name}));
		navigate(PROJECT_ROUTE + '/' + doc.id);
		setAnchorEl(null);
	}

	const areBoardsLoaded = boards !== undefined && boards?.docs;

	return (
		<div className="projects custom-scroll">
			<Button
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleButtonClick}
			>
				Projects
			</Button>
			<PopupIcon actionType="add" entity="board" />
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				className="custom-scroll"
				sx={{maxHeight: '300px'}}
			>
			{areBoardsLoaded ? boards.docs.map((doc: any) =>
				(
				<MenuItem key={doc.id} className="dropdown-item" onClick={() => handleItemClick(doc)}>
					<Grid
					container
					direction="row"
					justifyContent="space-between"
					>
					<span className="dropdown-item__name">{doc.data().name}</span>
					<div>
						<PopupIcon actionType="edit" entity="board" boardId={doc.id} />
						<PopupIcon actionType="delete" entity="board" boardId={doc.id} />
					</div>
					</Grid>
				</MenuItem>
				)
			) : <span className="info-message">No projects yet. Start by creating a new one.</span>
			}
			</Menu>
		</div>
	)
}
