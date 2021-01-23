import React, { useContext, useMemo } from 'react'
import Axios, { AxiosError } from 'axios'
import { AuthCtx } from '../../providers/auth.provider';
import { TChannel } from '../../midimaker/providers/SoundfontProvider/SoundFontProvider.types';

const baseUrl = `http://localhost:4000`

export default function useMidiFileApi() {
    const { accessToken, setAuthData } = useContext(AuthCtx)
    const axios = useMemo(() => Axios.create({
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }), [accessToken])
    const axiosFiles = useMemo(() => Axios.create({
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        }
    }), [accessToken])
    const fakeError = { 
        statusCode: 400,
        message: 'Unknown error',
        error: 'Unknown'
    }
    const parseError = (error: AxiosError) => error?.response?.data || fakeError
    const saveMidiFile = async ({ name, midiChannels, canvasImgBlob }: { name: string, midiChannels: TChannel[], canvasImgBlob?: Blob | undefined | null}) => {
        const body = {name, midiChannels }
        try{
            const { data } =  await axios.post(`${baseUrl}/midiFile`, body)
            // if(canvasImgBlob){
            //     await saveCanvasImage(data.id, canvasImgBlob)
            // }
            return data
        }
        catch(error){
            console.error(error)
            throw parseError(error)
        }
    }
    const saveCanvasImage = (id: string, canvasImgBlob: Blob)=> {
        const formData = new FormData()
        formData.append('file', canvasImgBlob, 'canvasImage')
        return axiosFiles.post(`${baseUrl}/midiFile/img/${id}`, formData)
        .then(res => console.log(res))
    }
    const updateMidiFile = async ({ id, name, midiChannels, canvasImgBlob }: { id: string, name: string, midiChannels: TChannel[],canvasImgBlob?: Blob | undefined | null}) => {
        const body = {name, midiChannels }
        return axios.put(`${baseUrl}/midiFile/${id}`, body)
        .catch(error=> {throw parseError(error)})
        
    }
    const getMidiFile = async ({ id }: { id: string }) => {
        return axios.get(`${baseUrl}/midiFile/${id}`)
            .then(res => res.data)
            .catch(error => {throw parseError(error)})
    }
    const getFilenames = async ()=> {
        return axios.get(`${baseUrl}/midiFile/getFilenames`)
            .then(res => res.data)
            .catch(error => {throw parseError(error)})
    }
    const getAllByUser = async ()=> {
        return axios.get(`${baseUrl}/midiFile/all`)
            .then(res => res.data)
            .catch(error => {throw parseError(error)})
    }
    const deleteMidiById = async (id: string)=> {
        return axios.delete(`${baseUrl}/midiFile/${id}`)
            .then(res => res.data)
            .catch(error => {throw parseError(error)})
    }
    return ({
        saveMidiFile,
        getMidiFile,
        getFilenames,
        updateMidiFile,
        getAllByUser,
        deleteMidiById
    })

}
