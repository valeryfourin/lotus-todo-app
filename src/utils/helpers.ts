import { SyntheticEvent } from "react";

export const preventProjectSwitch = (event: SyntheticEvent): void => {event.stopPropagation()};

export const getErrorMessage = (errorCode: string, errorMessage: string): string => {
	switch (errorCode) {
		case 'auth/invalid-email':
			return 'Invalid email address.';
		case 'auth/user-disabled':
			return 'User is disabled.';
		case 'auth/user-not-found':
			return 'User not found.';
		case 'auth/wrong-password':
			return 'Wrong password.';
		case 'auth/email-already-in-use':
			return 'Email is already in use.';
		case 'auth/weak-password':
			return 'Password is too weak. Should be at least 6 characters long.';
		default:
			return `Failed with error code: ${errorMessage}`;
	}
};
