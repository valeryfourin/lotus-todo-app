import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { TTask } from "../../components/types";
import { authUser, firestore } from "../../firebase";

export const addTask = async (boardId: string, columnId: string, taskFields: TTask) => {
    try {
        await setDoc(doc(firestore,
				`users/${authUser.currentUser?.uid}/boards/${boardId}/columns/${columnId}`,
				taskFields.id),
			taskFields);
    } catch (e) {
        console.error('Error creating new document: ', e);
    }
}

export const deleteTask = async (boardId: string, columnId: string, taskId: string) => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns/${columnId}/tasks`, taskId));
    } catch (e) {
        console.error(`Error deleting the document with id ${taskId}: `, e);
    }
}

export const editTask = async (boardId: string, columnId: string, taskId: string, editedFields: any) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns/${columnId}/tasks`, taskId),
        editedFields,
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${taskId}: `, e);
    }
}
