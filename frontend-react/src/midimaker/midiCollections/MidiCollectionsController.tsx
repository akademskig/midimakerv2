import  { useEffect, useState, useCallback } from 'react'
import useMidiFileApi from '../../api/protected/midiFile'
import useNotify from '../../components/common/notifications/notifications'
import { TChannel } from '../providers/SoundfontProvider/SoundFontProvider.types'


type TMidiFile = {
    id: string,
    name: string,
    midiChannels: TChannel[],
    canvasImgBlob: Buffer
}

const useMidiCollectionsController = () => {
    const { getAllByUser, deleteMidiById } = useMidiFileApi()
    const notify = useNotify()
    const [midiFiles, setMidiFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchMidis = useCallback(() => {
        setLoading(true)
        getAllByUser()
            .then(res => {
                setMidiFiles(res)
            })
            .catch(err => {
                console.error(err)
                notify('error', 'An error occurred. Try again.')
            })
            .finally(() => setLoading(false))
    }, [getAllByUser, notify])

    const onDeleteClick = useCallback(
        async (id) => {
            await deleteMidiById(id)
            await fetchMidis()
        },
        [deleteMidiById, fetchMidis],
    )
    useEffect(() => {
        fetchMidis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        {
            midiFiles,
            loading,
            onDeleteClick
        }
    )
}

export default useMidiCollectionsController