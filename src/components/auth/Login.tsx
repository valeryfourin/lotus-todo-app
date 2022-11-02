
import { useState } from 'react';
import { StyledButton } from '../styledComponents/StyledButton';
import { Header } from '../header';
import AuthForm from './AuthForm';

import './Login.css';

export default function Login(): JSX.Element {
  const [signIn, setSignIn] = useState(false);
  const [redirectToRegComponent, setRedirectToRegComponent] = useState(false);
  return (
    <div className="login-screen">
      <Header />
        
      <div className="login-screen__body">
        {signIn ? (
          <AuthForm redirectToRegComponent={redirectToRegComponent} />
        ) : (
          <>
            <h1 className='login-screen__slogan'>Organize and Manage</h1>
            <h2>with tranquility</h2>
            <h3>
              Log in to start working on your projects.
            </h3>

            <div className="login-screen__input">
              <StyledButton 
                variant="contained"
                onClick={() => {
                  setSignIn(true);
                  setRedirectToRegComponent(true);
                }}
                className="login-screen__button"
                size="large"
                title="GET STARTED"
              />
              <StyledButton
                variant="outlined"
                onClick={() => {
                  setSignIn(true);
                  setRedirectToRegComponent(false);
                }}
                className="login-screen__button login-screen__button--fixed"
                title="Sign in"
                sx={{ position: 'fixed'}}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}