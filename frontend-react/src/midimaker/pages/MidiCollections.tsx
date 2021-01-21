import { CircularProgress, IconButton, List, ListItem, makeStyles, Paper } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { Delete } from '@material-ui/icons'
import React, { useEffect, useState, useCallback } from 'react'
import useMidiFileApi from '../../api/protected/midiFile'
import useNotify from '../../components/common/notifications/notifications'
import { TChannel } from '../providers/SoundfontProvider/SoundFontProvider.types'


type TMidiFile = {
    id: string,
    name: string,
    midiChannels: TChannel[]
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
    }
  }));
const MidiCollections = () => {
    const { getAllByUser, deleteMidiById } = useMidiFileApi()
    const  notify = useNotify()
    const [midiFiles, setMidiFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const classes = useStyles()
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
            console.log(res)
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
        <Paper className={classes.paper}>
            {midiFiles.length > 0 && 
              <List>
                  {midiFiles.map((midiFile: TMidiFile)=> {
                    return (
                    <ListItem button className={classes.listItem}>
                        {midiFile?.name}
                        <IconButton onClick={()=> onDeleteClick(midiFile.id)}>
                            <Delete color={'error'}></Delete>
                        </IconButton>
                    </ListItem>
                    )
                  })}
             
          </List>
            }
          
        </Paper>
    )
}

export default MidiCollections