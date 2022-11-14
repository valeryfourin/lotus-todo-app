import { Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authUser, firestore } from "../../../firebase";
import { PROJECT_ROUTE } from "../../../utils/constants";
import { changeSelectedProject } from "../../store";

import './Home.css';

const Item = styled(Paper)(() => ({
	textAlign: 'center',
	height: 100,
	minWidth: 150,
	lineHeight: '100px',
	marginTop: 15,
	padding: '0 5px',
  }));

export const Home = (): JSX.Element => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [boards] = useCollection(collection(firestore, `users/${authUser.currentUser?.uid}/boards`));

	const handleItemClick = (doc:any) => {
		dispatch(changeSelectedProject({id: doc.id, name: doc.data().name}));
		navigate(PROJECT_ROUTE + '/' + doc.id);
	};

	const areBoardsLoaded = boards !== undefined && boards?.docs;

    return (
		<Container maxWidth="xl" className="home-screen">
			<span className="page-title">Overview</span>
			<Grid container marginTop="20px" justifyContent="space-evenly" minWidth="500px" maxWidth="600px">
				{areBoardsLoaded ? boards.docs.map((doc: any) =>
						(<Item key={doc.id} className="hoverable" elevation={5} onClick={() => handleItemClick(doc)}>{doc.data().name}</Item>)
					) : (
						<span className="info-message">No projects yet. Start by creating a new one.</span>
					)}
			</Grid>
		</Container>
	);
}
