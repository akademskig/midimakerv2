import { CRUD_UPDATE_START, CRUD_UPDATE_OK, FETCH_LIST_OK, FETCH_LIST, ADD_NEW_ITEM } from './crud.actionTypes';

export const fetchList = (fetchData: any) => ({
    type: FETCH_LIST,
    payload: fetchData
})
export const fetchListOk = (action: any) => ({
    type: FETCH_LIST_OK,
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

export const addNewItem = (addNewData: any) => ({
    type: ADD_NEW_ITEM,
    payload: addNewData
})