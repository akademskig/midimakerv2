import { useContext, useMemo } from 'react'
import Axios, { AxiosError, AxiosResponse } from 'axios'
import { AuthCtx } from '../../providers/auth.provider';
import { TChannel } from '../../midimaker/providers/SoundfontProvider/SoundFontProvider.types';

const baseUrl = `http://localhost:4000`

export default function useMidiFileApi() {
    const { accessToken } = useContext(AuthCtx)
    const axios = useMemo(() => Axios.create({
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }), [accessToken])
    const axiosFiles = useMemo(() => Axios.create({
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        responseType: 'blob'
    }), [accessToken])
    const fakeError = { 
        statusCode: 400,
        message: 'Unknown error',
        error: 'Unknown'
    }
    const parseError = (error: AxiosError) => {
        return error?.response?.data || fakeError}
    
    const saveMidiFile = async ({ name, midiChannels }: { name: string, midiChannels: TChannel[], canvasImgBlob?: Blob | undefined | null}) => {
        const formData = new FormData()
        formData.append('file', new Blob([JSON.stringify(midiChannels, null, 3)],{type : 'application/json' }))
        try {
            const { data } =  await axios.post(`${baseUrl}/midiFile/save/${name}`, formData)
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
        const formData = new FormData()
        formData.append('file', new Blob([JSON.stringify(midiChannels, null, 3)],{type : 'application/json' }))
        formData.append('name', name)
        return axios.put(`${baseUrl}/midiFile/update/${name}`, formData)
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
    const convert = async (id: string, ext: string)=> {
        return axiosFiles.post(`${baseUrl}/midiFile/convert/${id}/${ext}`)
            .then((res: AxiosResponse) => {
                return new Blob([res.data], { type: 'audio/mpeg'})})
            .catch(error => {throw parseError(error)})
    }
    const uploadFile = async (file: File)=> {
        const formData = new FormData()
        formData.append('file', file)
        return axios.post(`${baseUrl}/midiFile/upload`, formData)
            .then((res: AxiosResponse) => res.data)
            .catch(error => {throw parseError(error)})
    }
    return ({
        saveMidiFile,
        getMidiFile,
        getFilenames,
        updateMidiFile,
        getAllByUser,
        deleteMidiById,
        convert,
        uploadFile
    })

}
