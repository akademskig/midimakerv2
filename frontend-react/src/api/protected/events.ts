import Axios from 'axios'
import { useContext, useMemo, useState, useEffect } from 'react';
import { AuthCtx } from '../../providers/auth.provider';
import { DataCtx, TEvent } from '../../providers/data.provider';
const baseUrl = `http://localhost:4000`

type GetParams = {
    _end?: number,
    _order?: string,
    _sort?: string,
    q?: string,
    include: string
}

export const useEvents = () => {
    const { accessToken } = useContext(AuthCtx)
    const { setEvents, events } = useContext(DataCtx)

    const axios = useMemo(() => Axios.create({
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }), [accessToken])


    const fetchList = async ({ params }: { params?: GetParams }) => {
        let paramsString = ''
        if (params) {
            Object.keys(params).forEach((key: string, idx) => {
                //@ts-ignore
                paramsString = paramsString.concat(`${idx === 0 ? '?' : '&'}${key}=${params[key]}`)
            })
        }
        const res = await axios.get(`${baseUrl}/events${paramsString}`)
        setEvents(res.data)
    }
    const addNew = async (data: TEvent) => {
        let body = data
        await axios.post(`${baseUrl}/events`, body)
        await fetchList({ params: { include: 'location, owner '}})

    }

    return ({
        fetchList,
        addNew,
        events
    })
}

