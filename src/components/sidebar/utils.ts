import { addBoard, addColumn, deleteBoard, deleteColumn, editBoard, editColumn } from "../../services/firestore";
import { ActionType, Entity } from "../types";

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
            editBoard(boardId, nameReference.current.value);
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
            editColumn(boardId, columnId, nameReference.current.value);
        }
    } else if (actionType === 'delete') {
            deleteColumn(boardId, columnId);
    }
}