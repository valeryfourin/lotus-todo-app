
import { Home } from './components/dashboard/home';
import { Dashboard } from './components/dashboard';
import {
  HOME_ROUTE,
  PROJECT_ROUTE,
} from './utils/constants';

export const authRoutes = [
  {
    path: HOME_ROUTE,
    Component: Home,
  },
  {
    path: PROJECT_ROUTE + '/:id',
    Component: Dashboard,
  },
];
