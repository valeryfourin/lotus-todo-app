import Container from '@mui/material/Container';
import { Button, Divider, Typography } from "@mui/material";
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

export const Dashboard = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);
	const {id} = useParams();
    const navigate = useNavigate();
	const dispatch = useDispatch();

	const [board, loading] = useDocumentData(
		doc(firestore, `users/${authUser.currentUser?.uid}/boards`, id ?? ' ')
	);

	useEffect(() => {
		if (!selectedProject.id && id && board) {
		dispatch(changeSelectedProject({id, name: board.name}));
		}
	}, [board]);

    return (
        <Container className="dashboard-screen">
			{ selectedProject?.id ? (<>
					<BoardNavbar />
					<Divider />
					<ViewTabs />
				</>) : (<>
					<Typography>No such project exist</Typography>
					<Button variant="outlined" onClick={() => navigate(HOME_ROUTE)}>Go to Overview</Button>
				</>)
			}
        </Container>
	)
};
