import Container from '@mui/material/Container';
import { Divider } from "@mui/material";
import { BoardNavbar } from "./BoardNavbar";
import ViewTabs from "./ViewTabs";

import './Dashboard.css';
import { firestore } from '../../firebase';

export const Dashboard = (): JSX.Element => {

  // const todoRef = firestore.
    return (
        <Container className="dashboard-screen">
          <BoardNavbar />
          <Divider />
          <ViewTabs />
        </Container>
        );
};