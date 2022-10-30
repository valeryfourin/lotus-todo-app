import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRef, useState, RefObject } from 'react';
import { Button } from 'react-materialize';
import { authUser } from '../../firebase';

import './AuthForm.css';

export default function AuthForm({ redirectToRegComponent }: Record<string, boolean>): JSX.Element {
  const emailReference: RefObject<any> = useRef();
  const passwordReference: RefObject<any> = useRef();
  // const nameReference: RefObject<any> = useRef();
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
    signInWithEmailAndPassword(
        authUser,
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
        <h3>{isNewUser ? "Create new account" : "Sign In"}</h3>
        {/* {isNewUser ? ( <>
          <input ref={nameReference} placeholder="Name" type="text" id="name" />
          <label htmlFor="name">Nickname</label>
        </>) : null} */}

        <input ref={emailReference} placeholder="Email" type="email" id="email" />
        <label htmlFor="email">Email</label>
          
        <input ref={passwordReference} placeholder="Password" type="password" id="password" className="input-field"/>
        <label htmlFor="password">Password</label>

        <Button className="white signin-screen__button" waves="light" onClick={auth}>
          {isNewUser ? "Sign Up" : "Sign In"}
        </Button>

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
