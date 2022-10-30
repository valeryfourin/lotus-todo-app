
import { Home } from './components/home';
import { Project } from './components/dashboard/project/Project';
import {
  HOME_ROUTE,
  PROJECTS_ROUTE,
} from './utils/constants';

export const authRoutes = [
  {
    path: HOME_ROUTE,
    Component: Home,
  },
  {
    path: PROJECTS_ROUTE,
    Component: Project,
  },
];
