import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/auth/Login';
import { Home } from './components/dashboard/home';
import { Sidebar } from './components/sidebar';
import { login, logout, userSelector } from './components/store';
import { authUser } from './firebase';
import { authRoutes } from './routes';
import { LoadingIcon } from './components/styledComponents';

export function AppRouter(): JSX.Element {
	const user = useSelector(userSelector);
	const dispatch = useDispatch();
	const [isAppLoading, setIsAppLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(authUser, (userInfo) => {
		if (userInfo) {
			dispatch(
			login({
				uid: userInfo.uid,
				email: userInfo.email,
			}),
			);
			setIsAppLoading(false);
		} else {
			dispatch(logout());
			setIsAppLoading(false);
		}
		});
		return unsubscribe;
	}, [dispatch]);

	return isAppLoading ? (
				<LoadingIcon />
			) : user ? (
				<Box  sx={{ display: 'flex', flexDirection: "row" }}>
					<Sidebar />
					<Routes>
						{authRoutes.map(({ path, Component }) => (
							<Route key={path} path={path} element={<Component/>} />
						))}
						<Route path="*" element={<Home />} />

						<Route path="/project/*" element={<Home />} />
					</Routes>
				</Box>
			) : (
				<Login />
			)
		}

export default AppRouter;
