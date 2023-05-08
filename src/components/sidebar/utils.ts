
import { collection, DocumentData, getDocs } from 'firebase/firestore';
import { authUser, firestore } from '../../firebase';
import { addBoard, deleteBoard, editBoardName, addColumn, deleteColumn, editColumnName } from '../../services/firestore/boardService';
import { ActionType, Entity } from '../types';

export const getPopupTitle = (entity: Entity, action: ActionType) => {
    switch (action) {
      case 'add':
        return `Create new ${entity}`;
      case 'edit':
        return `Edit ${entity}`;
      case 'delete':
        return `Delete ${entity}`;
      default:
        return '';
    }
}

export const executeBoardRequest = (actionType: string, boardId: string = '', nameReference: any = {}) => {
    if (actionType === 'add') {
        if (nameReference.current) {
            addBoard(nameReference.current.value);
        }
    } else if (actionType === 'edit') {
        if (nameReference.current) {
            editBoardName(boardId, nameReference.current.value);
        }
    } else if (actionType === 'delete') {
            deleteBoard(boardId);
    }
}

export const executeColumnRequest = (actionType: string, boardId: string = '', columnId: string = '', nameReference: any = {}) => {
    if (actionType === 'add') {
        if (nameReference.current) {
            addColumn(boardId, nameReference.current.value);
        }
    } else if (actionType === 'edit') {
        if (nameReference.current) {
            editColumnName(boardId, columnId, nameReference.current.value);
        }
    } else if (actionType === 'delete') {
            deleteColumn(boardId, columnId);
    }
}

export const getBoardsNames = async (): Promise<Array<string>> => {
	const boards = await getDocs(collection(firestore, `users/${authUser.currentUser?.uid}/boards`));
	const boardsNames = boards.docs?.map((board: DocumentData) => board.data().name );
	return boardsNames.length ? boardsNames : [];
}

export const getColumnsNames = async (boardId: string | undefined): Promise<Array<string>> => {
	const columns = await getDocs(collection(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/columns`));
	const columnsNames = columns.docs?.map((column: DocumentData) => column.data().name );
	return columnsNames.length ? columnsNames : [];
}

export const getAllTasks = async (boardId: string | undefined): Promise<Array<DocumentData>> => {
	const tasks = await getDocs(collection(firestore, `users/${authUser.currentUser?.uid}/boards/${boardId}/tasks`));
	return tasks.docs?.length ? tasks.docs : [];
}
