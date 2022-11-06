import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { authUser, firestore } from "../firebase";

const boardsPath = `users/${authUser.currentUser?.uid}/boards`;

export const addBoard = async (name: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, name), { name: name });
    } catch (e) {
        console.error("Error creating new document: ", e);
    }
}

export const deleteBoard = async (entityId: string) => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, entityId));
    } catch (e) {
        console.error(`Error deleting the document with id ${entityId}: `, e);
    }
}

export const editBoard = async (entityId: string, newName: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards`, entityId), 
        { name: newName }, 
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${entityId}: `, e);
    }
}

export const addColumn = async (boardId: string, name: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}`, name), { name: name });
    } catch (e) {
        console.error("Error creating new document: ", e);
    }
}

export const deleteColumn = async (boardId: string, entityId: string) => {
    try {
        await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}`, entityId));
    } catch (e) {
        console.error(`Error deleting the document with id ${entityId}: `, e);
    }
}

export const editColumn = async (boardId: string, entityId: string, newName: string) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}`, entityId), 
        { name: newName }, 
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${entityId}: `, e);
    }
}
    