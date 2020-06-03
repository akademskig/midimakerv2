import { createSelector } from "reselect"

const selectData = (state: { data: any }) => state.data

export const selectDataList = (resource: string) => createSelector(
    [selectData],
    (data) => data[resource] || []
)
