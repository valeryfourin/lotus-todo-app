import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRef, useState, RefObject } from 'react';
import { app, auth } from '../../firebase';

import './AuthForm.css';

export default function AuthForm({ redirectToRegComponent }: Record<string, boolean>): JSX.Element {
  const emailReference: RefObject<any> = useRef();
  const passwordReference: RefObject<any> = useRef();
  const [isNewUser, setIsNewUser] = useState(redirectToRegComponent);

  const register = (event: any): any => {
    event.preventDefault();
    const auth = getAuth(app);
    if (emailReference.current && passwordReference.current) {
      createUserWithEmailAndPassword(
        auth,
        emailReference.current.value,
        passwordReference.current.value,
      )
      .then((authInfo: any) => {
        console.log(authInfo);
        return authInfo;
      })
      .catch((error: Error) => {
        alert(error.message);
      });
    };
    
  };

  const signIn = (event: any) => {
    event.preventDefault();
    const auth = getAuth(app);
    signInWithEmailAndPassword(
        auth,
        emailReference.current.value,
        passwordReference.current.value,
      )
      .then((authInfo: any) => {
        console.log(authInfo);
        return authInfo;
      })
      .catch((error: Error) => {
        alert(error.message);
      });
  };

  const auth = (event: any) => {
    if (isNewUser) {
      register(event);
    } else {
      signIn(event);
    }
  }

  return (
    <div className="signin-screen">
      <form>
        <h1>{isNewUser ? "Registration" : "Sign In"}</h1>
        <input ref={emailReference} placeholder="Email" type="email" />
        <input ref={passwordReference} placeholder="Password" type="password" />
        <button type="submit" onClick={auth}>
          {isNewUser ? "Sign Up" : "Sign In"}
        </button>

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
                <span className="signin-screen_gray">New to Netflix? </span>
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
