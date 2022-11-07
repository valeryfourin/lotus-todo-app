import Container from '@mui/material/Container';
import { Divider } from "@mui/material";
import { useParams } from 'react-router-dom';
import { BoardNavbar } from "./BoardNavbar";
import ViewTabs from "./ViewTabs";

import './Dashboard.css';

export const Dashboard = (): JSX.Element => {
    return (
        <Container maxWidth="xl" className="dashboard-screen">
          <BoardNavbar />
          <Divider />
          <ViewTabs />
        </Container>
        );
};