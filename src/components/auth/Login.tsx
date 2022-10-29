import { useState } from 'react';

import AuthForm from './AuthForm';

// import './Login.css';

export default function Login(): JSX.Element {
  const [signIn, setSignIn] = useState(false);
  const [redirectToRegComponent, setRedirectToRegComponent] = useState(false);
  return (
    <div className="login-screen">
      <div className="login-screen__background">
        {/* <img
          className="login-screen__logo"
          src="./image/Netflix_logo.png"
          alt="login screen background"
        /> */}
        <button
          onClick={() => {
            setSignIn(true);
            setRedirectToRegComponent(false);
          }}
          className="action-button login-screen__button"
          type="button"
        >
          Sign in
        </button>

        <div className="login-screen__gradient" />
      </div>
      <div className="login-screen__body">
        {signIn ? (
          <AuthForm redirectToRegComponent={redirectToRegComponent} />
        ) : (
          <>
            <h1>Unlimited films, TV programmes and more</h1>
            <h2>Watch anywhere</h2>
            <h3>
              Ready to watch? Log in to create or restart your membership.
            </h3>

            <div className="login-screen__input">
              <button
                onClick={() => {
                  setSignIn(true);
                  setRedirectToRegComponent(true);
                }}
                type="button"
                className="action-button login-screen__getStarted"
              >
                GET STARTED
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}