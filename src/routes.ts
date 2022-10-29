
// import Login from './components/auth/Login';
import Login from './components/auth/Login';
import { Home } from './components/home';
// import Home from './components/home/Home';
import { Project } from './components/dashboard/project/Project';
import {
  HOME_ROUTE,
  PROJECTS_ROUTE,
  SIGNIN_ROUTE,
  SIGNUP_ROUTE,
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

export const publicRoutes = [
  {
    path: HOME_ROUTE,
    Component: Login,
  },
  {
    path: SIGNUP_ROUTE,
    Component: Login,
  },
  {
    path: SIGNIN_ROUTE,
    Component: Login,
  },
];