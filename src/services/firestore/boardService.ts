import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { authUser, firestore } from "../../firebase";

export const addBoard = async (name: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, name), { name: name });
    } catch (e) {
        console.error("Error creating new document: ", e);
    }
}

export const deleteBoard = async (boardId: string) => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, boardId));
    } catch (e) {
        console.error(`Error deleting the document with id ${boardId}: `, e);
    }
}

export const editBoard = async (boardId: string, newName: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, boardId),
        { name: newName },
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${boardId}: `, e);
    }
}
