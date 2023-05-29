import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { authUser, firestore } from "../../firebase";
import { v4 as uuidv4 } from 'uuid';
import { TCalendarEvent, TProject } from "../../components/types";

// Important note: do not save fields with undefined value, use null instead

export const addBoard = async (name: string): Promise<void> => {
	const id = uuidv4();
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, id), { id, name, createdAt: new Date() });
    } catch (e) {
        console.error("Error creating new document: ", e);
    }
}

export const deleteBoard = async (boardId: string): Promise<void> => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, boardId));
    } catch (e) {
        console.error(`Error deleting the document with id ${boardId}: `, e);
    }
}

export const editBoard = async (boardId: string, editedFields: Partial<TProject>): Promise<void> => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, boardId),
        editedFields,
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${boardId}: `, e);
    }
}

export const editBoardName = async (boardId: string, newName: string): Promise<void> => {
    await editBoard(boardId, { name: newName });
}

export const addColumn = async (boardId: string, name: string): Promise<void> => {
	const id = uuidv4();
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`, id), { id, name, createdAt: new Date() });
    } catch (e) {
        console.error("Error creating new document: ", e);
    }
}

export const deleteColumn = async (boardId: string, columnId: string): Promise<void> => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`, columnId));
    } catch (e) {
        console.error(`Error deleting the document with id ${columnId}: `, e);
    }
}

export const editColumnName = async (boardId: string, columnId: string, newName: string): Promise<void> => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`, columnId),
        { name: newName },
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${columnId}: `, e);
    }
}

export const saveSchedule = async (boardId: string, schedule: Array<TCalendarEvent>): Promise<void> => {
	await editBoard(boardId, { schedule });
}

export const saveWorkingHours = async (boardId: string, workingHours: Array<Date>): Promise<void> => {
	await editBoard(boardId, { workingHours });
}
