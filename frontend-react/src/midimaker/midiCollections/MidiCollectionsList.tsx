import {CircularProgress, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Paper } from '@material-ui/core'
import { Delete,ExpandLess, ExpandMore, MusicNote } from '@material-ui/icons'
import React, { useState, useCallback, useMemo } from 'react'
import Loader from '../components/shared/loader/Loader';
import { getInstrumentLabel } from '../components/AudioSettingsController/utils';
import { formatDuration } from '../components/NotesGrid/components/utils';
import { TChannel } from '../providers/SoundfontProvider/SoundFontProvider.types';
import useMidiCollectionsController from './MidiCollectionsController';


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
    paper: {
        position: 'relative',
        margin: theme.spacing(1)
    },
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

  interface IMidiCollectionsItem {
    key: number,
    midiFile: TMidiFile,
}
const MidiCollectionsItem = ({midiFile, key }: IMidiCollectionsItem)=> {
    const { onDeleteClick } = useMidiCollectionsController()
    const classes = useStyles()
    const [open, setOpen] = useState(false)

    const handleItemClick = useCallback(()=> {
        setOpen(!open)
    }, [open])

    const duration = useMemo(()=> {
        const totalDuration = midiFile.midiChannels.reduce(
            (acc, curr) => (curr.duration > acc ? curr.duration : acc),
            0)
        return formatDuration(totalDuration)
        
    }, [])

    return (
        <>
        <ListItem key={key} button onClick={handleItemClick}className={classes.listItem}>
            <ListItemText>
            {midiFile?.name}
            </ListItemText>
            {open ? <ExpandLess /> : <ExpandMore />}

            <IconButton onClick={()=> onDeleteClick(midiFile.id)}>
                <Delete color={'error'}></Delete>
            </IconButton>
        </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItem>
                    <ListItemText>
                        {`Duration: ${duration} m` }
                    </ListItemText>
                </ListItem>
                <ListItem button className={classes.nested}>
                    <List>
                    {midiFile.midiChannels.map(channel=> 
                    <ListItem>
                        <ListItemIcon style={{color: channel.color}}>
                        <MusicNote />
                        </ListItemIcon>
                        <ListItemText>
                        {getInstrumentLabel(channel.instrumentName)} 
                        </ListItemText>
                    
                       </ListItem>)}
                    </List>
                    
                </ListItem>
            </Collapse>
            </>
    )
}

const MidiCollectionsList = () => {
    const classes = useStyles()
    const { midiFiles, loading } = useMidiCollectionsController()
    return (
        <>
            {loading && <Loader/>}
        <Paper className={classes.paper}>
            {midiFiles.length > 0 && 
              <List>
                  {midiFiles.map((midiFile: TMidiFile, key:number)=> {
                    return (
                        <MidiCollectionsItem 
                            midiFile={midiFile} 
                            key={key}
                        />
                    )
                    })}
                </List>
            }
          
        </Paper>
        </>
    )
}

export default MidiCollectionsList