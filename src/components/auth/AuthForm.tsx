
import { useRef, useState, RefObject } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { authUser } from '../../firebase';

import './AuthForm.css';
import { StyledButton, StyledTextField } from '../styledComponents';

export default function AuthForm({ redirectToRegComponent }: Record<string, boolean>): JSX.Element {
  const emailReference: RefObject<HTMLInputElement> = useRef(null);
  const passwordReference: RefObject<HTMLInputElement> = useRef(null);
  const [isNewUser, setIsNewUser] = useState(redirectToRegComponent);

  const register = (event: any): void => {
    event.preventDefault();
    if (emailReference.current && passwordReference.current) {
      createUserWithEmailAndPassword(
        authUser,
        emailReference.current.value,
        passwordReference.current.value,
      )
      .then((authInfo: any) => {
        return authInfo;
      })
      .catch((error: Error) => {
        alert(error.message);
      });
    };
  };

  const signIn = (event: any) => {
    event.preventDefault();
    if (emailReference.current && passwordReference.current) {
		signInWithEmailAndPassword(
			authUser,
			emailReference.current.value,
			passwordReference.current.value,
		)
		.then((authInfo: any) => {
		return authInfo;
		})
		.catch((error: Error) => {
		alert(error.message);
		});
	}
  };

  const auth = (event: any) => {
    if (isNewUser) {
      register(event);
    } else {
      signIn(event);
    }
  };

  return (
    <div className="signin-screen">
      <form>
        <h3>{isNewUser ? "Create new account" : "Sign In"}</h3>
        <StyledTextField inputRef={emailReference} className="signin-screen__field " autoComplete="email" id="outlined-basic" label="Email" type="email"  margin="normal"/>
        <StyledTextField
          className="signin-screen__field"
          inputRef={passwordReference}
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="normal"
        />

        <StyledButton
          className="white signin-screen__button"
          variant="contained"
          onClick={auth}
          title={isNewUser ? "Sign Up" : "Sign In"}
        />

        <h4>
          {isNewUser ? (
            <>
              <span className="signin-screen_gray">Already have an account? </span>
              <span
                className="signin-screen__link"
                onClick={() => setIsNewUser(false)}
              >
                Sign In.
              </span>
            </>
            ) : (
              <>
                <span className="signin-screen--gray">New to Lotus? </span>
                <span
                  className="signin-screen__link"
                  onClick={() => setIsNewUser(true)}
                >
                  Sign Up now.
                </span>
              </>
            )}
        </h4>
      </form>
    </div>
  );
}
