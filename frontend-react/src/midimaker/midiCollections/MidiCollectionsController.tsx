import { CircularProgress, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Paper } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { Delete, StarBorder,ExpandLess, ExpandMore, MusicNote } from '@material-ui/icons'
import React, { useEffect, useState, useCallback } from 'react'
import useMidiFileApi from '../../api/protected/midiFile'
import useNotify from '../../components/common/notifications/notifications'
import MidiCollections from '../pages/MidiCollections'
import { TChannel } from '../providers/SoundfontProvider/SoundFontProvider.types'


type TMidiFile = {
    id: string,
    name: string,
    midiChannels: TChannel[],
    canvasImgBlob: Buffer
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    paper: {},
    listItem: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    image: {
        width: '200px',
        height: '200px'
    },
    nested: {

    }
  }));
const useMidiCollectionsController = () => {
    const { getAllByUser, deleteMidiById } = useMidiFileApi()
    const  notify = useNotify()
    const [midiFiles, setMidiFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const onDeleteClick = useCallback(
        async(id) => {
            await deleteMidiById(id)
                fetchMidis()
        },
        [],
    )
    const fetchMidis = useCallback(()=> {
        setLoading(true)
        getAllByUser()
        .then(res => {
            setMidiFiles(res)
        })
        .catch(err=> {
            console.error(err)
            notify('error', 'An error occurred. Try again.')
        })
        .finally(()=> setLoading(false))
    }, [])

    useEffect(()=> {
        fetchMidis()
    }, [onDeleteClick])
    return (
      {
          midiFiles,
          loading,
          onDeleteClick
      }
    )
}

export default useMidiCollectionsController