import { CircularProgress, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Paper, Divider, ListItemSecondaryAction } from '@material-ui/core'
import { Delete, ExpandLess, ExpandMore, MusicNote, Radio, PlaceOutlined, CloudDownload } from '@material-ui/icons'
import React, { useState, useCallback, useMemo } from 'react'
import Loader from '../components/shared/loader/Loader';
import { getInstrumentLabel } from '../components/AudioSettingsController/utils';
import { formatDuration } from '../components/NotesGrid/components/utils';
import { TChannel } from '../providers/SoundfontProvider/SoundFontProvider.types';
import useMidiCollectionsController from './MidiCollectionsController';
import EmptyListDisplay from './EmptyListDisplay';
import useMidiFileApi from '../../api/protected/midiFile';

type TMidiFile = {
    id: string,
    name: string,
    midiChannels: TChannel[],
    canvasImgBlob: Buffer,
    createdAt: string
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    paper: {
        padding: 0,
        borderRadius: 0,
        position: 'relative',
        margin: theme.spacing(1),
        boxShadow: theme.shadows[11]
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    image: {
        width: '200px',
        height: '200px'
    },
    list: {
        padding: 0,
    },
    nested: {

    },
    divider: {
    },
    expandIcon: {
        color: theme.palette.secondary.dark
    }
}));

interface IMidiCollectionsItem {
    key: number,
    midiFile: TMidiFile,
    onDeleteClick: (midiId: string) => void,
    convert: (id: string, ext: string) => Promise<any>
}
const MidiCollectionsItem = ({ midiFile, key, onDeleteClick, convert }: IMidiCollectionsItem) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [midiUrl, setMidiUrl] = useState<{name: string, url: any} | null>()
    const handleItemClick = useCallback(() => {
        setOpen(!open)
    }, [open])
    const duration = useMemo(() => {
        const totalDuration = midiFile.midiChannels.reduce(
            (acc, curr) => (curr.duration > acc ? curr.duration : acc),
            0)
        return formatDuration(totalDuration)

    }, [midiFile.midiChannels])

    const handleConvertClick = useCallback((id: string) => {
        convert(id, 'mp3')
            .then(blob => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setMidiUrl({
                        name: 'file.mp3',
                        url: reader.result
                    })
                }
                reader.readAsDataURL(blob)
            })
            .catch(error => {
                console.error(error)
            })
    }, [convert, setMidiUrl])
    return (
        <>
            <ListItem key={key} button onClick={handleItemClick} className={classes.listItem}>
                <ListItemText>
                    {midiFile?.name}
                </ListItemText>
                {open ? <ExpandLess className={classes.expandIcon} /> : <ExpandMore className={classes.expandIcon} />}

                <IconButton onClick={() => onDeleteClick(midiFile.id)}>
                    <Delete color={'error'}></Delete>
                </IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItem >
                    <ListItemText>
                        {`Duration: ${duration} m`}
                    </ListItemText>
                </ListItem>
                <ListItem button >
                    <List>
                        {midiFile.midiChannels.map(channel =>
                            <ListItem>
                                <ListItemIcon style={{ color: channel.color }}>
                                    <MusicNote />
                                </ListItemIcon>
                                <ListItemText>
                                    {getInstrumentLabel(channel.instrumentName)}
                                </ListItemText>
                            </ListItem>
                        )}
                    </List>

                </ListItem>
                <ListItem button >
                    <ListItemIcon onClick={() => handleConvertClick(midiFile.id)}>
                        <Radio />
                    </ListItemIcon>
                    {midiUrl && 
                    <ListItemIcon >
                        <a href={midiUrl.url} onClick={() => setMidiUrl(null)} download={midiUrl.name}>
                            <IconButton title="Download" >
                                <CloudDownload />
                            </IconButton>
                        </a> 
                    </ListItemIcon>
                        }
                </ListItem>
            </Collapse>
        </>
    )
}

const MidiCollectionsList = () => {
    const classes = useStyles()
    const { midiFiles, loading, onDeleteClick } = useMidiCollectionsController()
    const { convert } = useMidiFileApi()
    return (
        <>
            {loading && <Loader />}
            {midiFiles.length > 0 ?
                <Paper className={classes.paper}>
                    <List className={classes.list}>
                        {midiFiles.map((midiFile: TMidiFile, key: number) => {
                            return (
                                <>
                                    <MidiCollectionsItem
                                        midiFile={midiFile}
                                        key={key}
                                        onDeleteClick={onDeleteClick}
                                        convert={convert}
                                    />
                                    <Divider className={classes.divider} />

                                </>
                            )
                        })}
                    </List>
                </Paper> : <EmptyListDisplay />
            }
        </>
    )
}

export default MidiCollectionsList