
import { useRef, useState, RefObject, SyntheticEvent } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { authUser } from '../../firebase';
import { StyledButton, StyledTextField } from '../styledComponents';
import { getErrorMessage, preventProjectSwitch } from '../../utils/helpers';
import { fieldsMissingMessage } from '../../utils/constants';

import './AuthForm.css';

export default function AuthForm({ redirectToRegComponent }: Record<string, boolean>): JSX.Element {
	const emailReference: RefObject<HTMLInputElement> = useRef(null);
	const passwordReference: RefObject<HTMLInputElement> = useRef(null);
	const [isNewUser, setIsNewUser] = useState(redirectToRegComponent);
	const [error, setError] = useState('');

	const register = (): void => {
		if (emailReference.current && passwordReference.current) {
			createUserWithEmailAndPassword(
				authUser,
				emailReference.current.value,
				passwordReference.current.value,
			)
			.then((authInfo: UserCredential) => {
				return authInfo;
			})
			.catch((error: FirebaseError ) => {
				setError(getErrorMessage(error.code, error.message));
			});
		};
	};

	const signIn = () => {
		if (emailReference.current && passwordReference.current) {
			signInWithEmailAndPassword(
				authUser,
				emailReference.current.value,
				passwordReference.current.value,
			)
			.then((authInfo: UserCredential) => {
				return authInfo;
			})
			.catch((error: FirebaseError) => {
				setError(getErrorMessage(error.code, error.message));
			});
		}
	};

	const auth = (event: SyntheticEvent) => {
		preventProjectSwitch(event);
		setError('');

		if (!emailReference.current?.value || !passwordReference.current?.value) {
			return setError(fieldsMissingMessage);
		}

		if (isNewUser) {
			register();
		} else {
			signIn();
		}
	};

  return (
    <div className="signin-screen">
		<form>
			<h3>{isNewUser ? "Create new account" : "Sign In"}</h3>
			<StyledTextField
				inputRef={emailReference}
				autoComplete="email"
				label="Email"
				type="email"
				onKeyDown={() => setError('')}
				error={error}
				sx={{marginBottom: '10px'}}
				required
			/>
			<StyledTextField
				inputRef={passwordReference}
				label="Password"
				type="password"
				autoComplete="current-password"
				error={error}
				onKeyDown={() => setError('')}
				sx={{marginBottom: '10px'}}
				required
			/>
			{ error && (<div className="error-helper-text">{error}</div>) }
			<StyledButton
				variant="contained"
				onClick={auth}
				title={isNewUser ? "Sign Up" : "Sign In"}
			/>
			<h4>
			{isNewUser ? (
				<>
					<span className="signin-screen__gray">Already have an account? </span>
					<span className="signin-screen__link" onClick={() => setIsNewUser(false)}>Sign In.</span>
				</>
				) : (
				<>
					<span className="signin-screen__gray">New to Lotus? </span>
					<span className="signin-screen__link" onClick={() => setIsNewUser(true)}> Sign Up now.</span>
				</>
				)}
			</h4>
		</form>
    </div>
  );
}
