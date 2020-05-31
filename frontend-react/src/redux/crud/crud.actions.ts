import { CRUD_UPDATE_START, CRUD_UPDATE_OK, CRUD_GET_LIST_OK, CRUD_GET_LIST_START } from './crud.actionTypes';

export const crudGetListStart = (action: any) => ({
    type: CRUD_GET_LIST_START,
    payload: action
})
export const crudGetListOk = (action: any) => ({
    type: CRUD_GET_LIST_OK,
    payload: action
})
export const crudUpdateStart = (updateData: any) => ({
    type: CRUD_UPDATE_START,
    payload: updateData
})

export const crudUpdateOk = (action: any) => ({
    type: CRUD_UPDATE_OK,
    payload: action.payload
})
