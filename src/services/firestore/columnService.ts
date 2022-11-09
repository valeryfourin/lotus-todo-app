import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { authUser, firestore } from "../../firebase";

export const addColumn = async (boardId: string, name: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`, name), { name: name });
    } catch (e) {
        console.error("Error creating new document: ", e);
    }
}

export const deleteColumn = async (boardId: string, columnId: string) => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`, columnId));
    } catch (e) {
        console.error(`Error deleting the document with id ${columnId}: `, e);
    }
}

export const editColumn = async (boardId: string, columnId: string, newName: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`, columnId),
        { name: newName },
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${columnId}: `, e);
    }
}
