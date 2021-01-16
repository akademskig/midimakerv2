import React, { useContext, useMemo } from 'react'
import Axios, { AxiosError } from 'axios'
import { AuthCtx } from '../../providers/auth.provider';
import { Player } from 'soundfont-player';

const baseUrl = `http://localhost:4000`

export default function useInstrumentsApi() {
    const { accessToken, setAuthData } = useContext(AuthCtx)
    const axios = useMemo(() => Axios.create({
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }), [accessToken])
    const fakeError = { 
        statusCode: 400,
        message: 'Unknown error',
        error: 'Unknown'
    }
    const parseError = (error: AxiosError) => error?.response?.data || fakeError
    const saveInstrument = async ({ name, player }: { name: string, player: Player }) => {
        const body = {name, player }
        return axios.post(`${baseUrl}/instruments`, body)
        .catch(error=> {throw parseError(error)})
        
    }
    const getInstrument = async ({ name }: { name: string }) => {
        return axios.get(`${baseUrl}/instruments/${name}`)
            .then(res => res.data)
            .catch(error => {throw parseError(error)})
    }
    return ({
        saveInstrument,
        getInstrument,
    })

}
