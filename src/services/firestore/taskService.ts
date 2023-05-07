import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { TTask } from "../../components/types";
import { authUser, firestore } from "../../firebase";
import { v4 as uuidv4 } from 'uuid';

export const addTask = async (boardId: string, taskFields: TTask) => {
	const id = uuidv4();
    try {
        await setDoc(doc(firestore,
			`users/${authUser.currentUser?.uid}/boards/${boardId}/tasks`, id), { ...taskFields, id, createdAt: new Date()  });
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

export const editTask = async (boardId: string, taskId: string, editedFields: TTask) => {
    try {
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/tasks`, taskId),
        editedFields,
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${taskId}: `, e);
    }
}

export const setTaskCompleted = async (boardId: string, taskId: string, completed: boolean) => {
    try {
		const completeDate =  { completeDate: (completed ? new Date() : null) };
        await setDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/tasks`, taskId),
        { completed, ...completeDate },
        { merge: true });
    } catch (e) {
        console.error(`Error updating the document with id ${taskId}: `, e);
    }
}

// export const switchTaskColumn = async (boardId: string, oldColumnId: string, newColumnId: string, taskId: string) => {
//     try {
// 		const taskRef = doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns/${oldColumnId}/tasks`, taskId);
// 		const columnRef = doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`, newColumnId);

// 		const taskSnap = await getDoc(taskRef);
// 		const columnSnap = await getDoc(columnRef);

// 		if (taskSnap.exists() && columnSnap.exists()) {
// 			const taskData = taskSnap.data();
// 			const columnData = taskSnap.data();

// 			await deleteDoc(doc(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns/${oldColumnId}/tasks`, taskId));
// 			await setDoc(doc(firestore,
// 				`users/${authUser.currentUser?.uid}/boards/${boardId}/columns/${newColumnId}/tasks`, taskData.id), { ...taskData, status: columnData.name});

// 		} else {
// 			console.log('No such document or the column does not exist!');
// 		}


//     } catch (e) {
//         console.error(`Error while moving document with id ${taskId}: `, e);
//     }
// }
