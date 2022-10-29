import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import { login, logout, userSelector } from './components/store';
import { app } from './firebase';

import { authRoutes } from './routes';

// import './App.css';

export function AppRouter(): JSX.Element {
  const user = useSelector(userSelector);
  console.log(user);
  const dispatch = useDispatch();
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        dispatch(
          login({
            uid: userInfo.uid,
            email: userInfo.email,
          }),
        );
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);
  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <Routes>
          {authRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component/>} />
          ))}
        </Routes>
      )}
    </>
  );
}

export default AppRouter;