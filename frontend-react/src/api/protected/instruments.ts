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
    const parseInstrument = ({ name, player}: {name: string, player: any}) => {
        const playerData = Buffer.from(player)
        console.log(JSON.parse(playerData.toString('utf-8')))
        return {
            name,
            player: JSON.parse('')
        }

    }
    const saveInstrument = async ({ name, player }: { name: string, player: Player }) => {
        const formData = new FormData()
        formData.append('file', new Blob([JSON.stringify(player, null, 3)],{type : 'application/json' }))
        formData.append('name', name)
        return axios.post(`${baseUrl}/instruments/${name}`, formData)
        .catch(error=> {throw parseError(error)})
        
    }
    const getInstrument = async ({ name }: { name: string }) => {
        return axios.get(`${baseUrl}/instruments/${name}`)
            .then(res => parseInstrument(res.data))
            .catch(error => {throw parseError(error)})
    }
    return ({
        saveInstrument,
        getInstrument,
    })

}
