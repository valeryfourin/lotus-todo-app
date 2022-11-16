import { Box, CircularProgress, Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authUser, firestore } from "../../../firebase";
import { PROJECT_ROUTE } from "../../../utils/constants";
import { changeSelectedProject } from "../../store";
import { BoardNavbar } from "../BoardNavbar";

import './Home.css';

const Item = styled(Paper)(() => ({
	textAlign: 'center',
	height: 100,
	minWidth: 150,
	lineHeight: '100px',
	marginTop: 15,
	marginRight: 15,
	padding: '0 5px',
  }));

export const Home = (): JSX.Element => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [boards, loading] = useCollectionData(query(collection(firestore, `users/${authUser.currentUser?.uid}/boards`), orderBy('createdAt')));

	const handleItemClick = (doc:any) => {
		dispatch(changeSelectedProject({id: doc.id, name: doc.name}));
		navigate(PROJECT_ROUTE + '/' + doc.id);
	};

	const areBoardsLoaded = boards && boards.length;

    return (
		<Container maxWidth="xl" className="home-screen">
			<BoardNavbar title="Overview"></BoardNavbar>
			<Grid container marginTop="20px" justifyContent="flex-start" minWidth="500px" maxWidth="600px">
				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box>
				) : areBoardsLoaded ? boards.map((doc: any) =>
						(<Item key={doc.id} className="hoverable" elevation={5} onClick={() => handleItemClick(doc)}>{doc.name}</Item>)
					) : (
						<span className="info-message">No projects yet. Start by creating a new one.</span>
					)
				}
			</Grid>
		</Container>
	);
}
