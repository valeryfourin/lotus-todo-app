import Container from '@mui/material/Container';
import { Button, Typography } from "@mui/material";
import { BoardNavbar } from "./BoardNavbar";
import ViewTabs from "./ViewTabs";

import './Dashboard.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { changeSelectedProject, selectedProjectSelector } from '../store';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { authUser, firestore } from '../../firebase';
import { HOME_ROUTE } from '../../utils/constants';
import { PopupCreateButton } from './popupCreateButton/PopupCreateButton';

export const Dashboard = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);
	const {id} = useParams();
    const navigate = useNavigate();
	const dispatch = useDispatch();

	const [board] = useDocumentData(
		doc(firestore, `users/${authUser.currentUser?.uid}/boards`, id ?? ' ')
	);

	useEffect(() => {
		if (!selectedProject.id && id && board) {
		dispatch(changeSelectedProject({id, name: board.name}));
		}
	}, [selectedProject.id, id, board, dispatch]);

    return (
        <Container className="board-screen">
			{ selectedProject?.id ? (<>
					<BoardNavbar title={selectedProject.name}>
						<PopupCreateButton />
					</BoardNavbar>
					<ViewTabs />
				</>) : (<>
					<Typography>No such project exist</Typography>
					<Button variant="outlined" onClick={() => navigate(HOME_ROUTE)}>Go to Overview</Button>
				</>)
			}
        </Container>
	)
};
