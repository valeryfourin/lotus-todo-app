import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { TTask } from "../../components/types";
import { authUser, firestore } from "../../firebase";
import { v4 as uuidv4 } from 'uuid';

export const addTask = async (boardId: string, taskFields: Partial<TTask>) => {
	const id = uuidv4();
    try {
        await setDoc(doc(firestore,
			`users/${authUser.currentUser?.uid}/boards/${boardId}/tasks`, id), {...taskFields, id, createdAt: new Date()});
    } catch (e) {
        console.error('Error creating new document: ', e);
    }
}

export const deleteTask = async (boardId: string, taskId: string) => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/tasks`, taskId));
    } catch (e) {
        console.error(`Error deleting the document with id ${taskId}: `, e);
    }
}

export const editTask = async (boardId: string, taskId: string, editedFields: Partial<TTask>) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/tasks`, taskId),
        editedFields,
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${taskId}: `, e);
    }
}

export const setTaskCompleted = async (boardId: string, taskId: string, completed: boolean) => {
	const completeDate =  { completeDate: (completed ? new Date() : null) };
	await editTask(boardId, taskId, { completed, ...completeDate });
}

export const setTaskScheduled = async (boardId: string, taskId: string, isScheduled: boolean) => {
    await editTask(boardId, taskId, { isScheduled });
}
