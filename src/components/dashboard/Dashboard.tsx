import Container from '@mui/material/Container';
import { Divider } from "@mui/material";
import { BoardNavbar } from "./BoardNavbar";
import ViewTabs from "./ViewTabs";

import './Dashboard.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { changeSelectedProject, selectedProjectSelector } from '../store';

export const Dashboard = (): JSX.Element => {
  const selectedProject = useSelector(selectedProjectSelector);
  const {id} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedProject.id && id) {
      dispatch(changeSelectedProject({id, name: id}));
    }

  }, []);
    return (
        <Container maxWidth="xl" className="dashboard-screen">
          <BoardNavbar />
          <Divider />
          <ViewTabs />
        </Container>
        );
};