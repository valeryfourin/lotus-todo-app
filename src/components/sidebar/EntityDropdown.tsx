import { MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Menu, MenuItem } from '@mui/material';
import { collection, query, orderBy, DocumentData } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import PopupIcon from './PopupIcon';
import { PROJECT_ROUTE } from '../../utils/constants';
import { changeSelectedProject } from '../store';
import { authUser, firestore } from '../../firebase';
import { LoadingIcon } from '../styledComponents';

export const EntityDropdown = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [boards, loading] = useCollectionData(query(collection(firestore, `users/${authUser.currentUser?.uid}/boards`), orderBy('createdAt')));

	const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget) };
	const handleClose = () => { setAnchorEl(null) };
	const handleItemClick = (doc:any) => {
		dispatch(changeSelectedProject({id: doc.id, name: doc.name}));
		navigate(PROJECT_ROUTE + '/' + doc.id);
		setAnchorEl(null);
	}

	const areBoardsLoaded = boards && boards.length;

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
			{loading ? (
					<LoadingIcon />
				) : ( areBoardsLoaded ? boards.map((doc: DocumentData) =>
					(
						<MenuItem key={doc.id} className="dropdown-item" onClick={() => handleItemClick(doc)}>
							<Grid
							container
							direction="row"
							justifyContent="space-between"
							>
							<span className="dropdown-item__name" title={doc.name}>{doc.name}</span>
							<div>
								<PopupIcon actionType="edit" entity="board" boardId={doc.id} />
								<PopupIcon actionType="delete" entity="board" boardId={doc.id} />
							</div>
							</Grid>
						</MenuItem>
					))
				 : <span className="info-message">No projects yet. Start by creating a new one.</span>
				)
			}
			</Menu>
		</div>
	)
}
