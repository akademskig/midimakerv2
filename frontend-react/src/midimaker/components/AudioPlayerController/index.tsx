import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, makeStyles, TextField, Theme } from '@material-ui/core'
import { Pause, PlayArrow, Save, Stop, AttachFile } from '@material-ui/icons'
import React, { ReactElement, useContext, useState, useCallback } from 'react'
import classnames from 'classnames'
import { useAudioPlayer } from '../../controllers/AudioPlayer'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { NotesGridControllerCtx } from '../NotesGrid/components/NotesGridController'
import useMidiFileApi from '../../../api/protected/midiFile'
import useNotify from '../../../components/common/notifications/notifications'

type TMidiFile ={ 
    name: string,
    id: string
}
const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
      display: 'flex',
      padding: '0.5em',
      height: '61px',
      width :'100%',
      backgroundColor: theme.palette.primary.main,
      justifyContent: 'space-between'
    },
    button: {
        color: theme.palette.primary.contrastText,
        padding: '0.2em 0.5em',
       '&.active': {
           color: 'red'
       },
       '&:hover': {
            '& svg' : {
                color: theme.palette.secondary.light
            }
        },
    },
    audioControlButtons: {
      display: 'flex',
    },
    dbControlButtons: {
        display: 'flex',
    },
    fileList: {
        maxHeight: '300px',
        overflowY: 'auto'
    }
  }))

function AudioPlayerController({ top = false}): ReactElement{
    const { playAll, stopPlayAll } = useAudioPlayer()
    // const { renderPlay, stopPlayRender } = useContext(CanvasContext)
    const { setControllerState, controllerState, channels, setChannels } = useContext(AudioStateProviderContext)
    const { renderPlay, stopPlayRender, pausePlayRender, getBlobFromCanvas } = useContext(NotesGridControllerCtx)
    const { saveMidiFile, getFilenames, getMidiFile, updateMidiFile } = useMidiFileApi()
    const notify = useNotify()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [selectFileOpen, setSelectFileOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<TMidiFile | null>(null)
    const [files, setFiles ] = useState<TMidiFile[]>([])
    const [midiName, setMidiName] = useState('test')
    const [canvasBlob, setCanvasBlob ] = useState<Blob | null>(null)
    const onPlayButtonClick = () => {
        if(controllerState.PLAYING){
            return
        }
        playAll()
        renderPlay()
        setControllerState({'PLAYING': true, 'PAUSED': false})
    }
    const onStopButtonClick =() => {
        stopPlayAll()
        stopPlayRender()
        setControllerState({'PLAYING': false, 'PAUSED': false})
    }
    const onPauseButtonClick = () => {
        if(!controllerState.PLAYING){
            return
        }
        pausePlayRender()
        stopPlayAll()
        setControllerState({'PLAYING': false, 'PAUSED': true })
    }

   
    const onSaveClick = useCallback(async() => {
        if(selectedFile){
            const blob = await getBlobFromCanvas()
            updateMidiFile({...selectedFile, midiChannels: channels, canvasImgBlob: blob })
                .then(res=> notify('success', 'Midi saved.'))
                .catch(error => notify('error', 'An error occurred.'))
        }
        else {
            setOpen(true)
        }
    }, [selectedFile, channels])
    console.log(channels)

    const onNameSetClick = useCallback(async () => {
        const blob = await getBlobFromCanvas()
        saveMidiFile({ name: midiName, midiChannels: channels, canvasImgBlob: blob })
        .then(({id, name, midiChannels}) => {
            setSelectedFile({ id, name})
            setChannels(midiChannels)
            notify('success', 'Midi saved.')
                setOpen(false)
            } )
        .catch(error=>notify('info', error.message))
    }, [ midiName, channels ])
    const onSelectFileClick = useCallback(
        async() => {
            const files = await getFilenames()
            console.log(files)
            setFiles(files)
            setSelectFileOpen(true)
        },
        [],
    )
    const onFileSelectClick = useCallback(
        async(file) => {
            const res = await getMidiFile({id: file.id})
            if(res){
                setChannels(res.midiChannels)
                setSelectedFile(file)
            }
            setSelectFileOpen(false)
        },
        [channels],
    )
    return(
        <>
        <div className={classes.container}>
            {
                top && 
                <>
                <div className={classes.audioControlButtons}>
                    <IconButton onClick={onPlayButtonClick} className={classnames(classes.button, {active: controllerState.PLAYING})}>
                        <PlayArrow/>
                    </IconButton>
                    <IconButton onClick={onPauseButtonClick} className={classnames(classes.button, {active: controllerState.PAUSED})}>
                        <Pause/>
                    </IconButton>
                    <IconButton onClick={onStopButtonClick} className={classes.button}>
                        <Stop/>
                    </IconButton>
                </div>
                <div className={classes.dbControlButtons}>
                    <Button>
                        {selectedFile?.name || ''}
                    </Button>
                    <IconButton onClick={onSelectFileClick} className={classes.button}>
                        <AttachFile/>
                    </IconButton>
                    <IconButton onClick={onSaveClick} className={classes.button}>
                        <Save/>
                    </IconButton>
                </div>
                <Dialog open={open} onClose={()=> setOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Save midi</DialogTitle>
                    <DialogContent>
                    <TextField
                        value={midiName}
                        onChange={(e) => setMidiName(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Midi name"
                        type="text"
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=> setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=> onNameSetClick()} color="primary">
                        OK
                    </Button>
                    </DialogActions>
            </Dialog>
                <Dialog open={selectFileOpen} onClose={()=> setSelectFileOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Select file...</DialogTitle>
                    <DialogContent>
                        <List className={classes.fileList}>
                            { files.map(file=> 
                                <ListItem>
                                    <Button onClick={()=> onFileSelectClick(file)}color="secondary">
                                        {file.name}
                                    </Button>
                                </ListItem>
                                
                                )}
                        </List>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=> setSelectFileOpen(false)} color="primary">
                        Cancel
                    </Button>
                    </DialogActions>
            </Dialog>
            </>
            }
        </div>
        </>

    )
}

export default AudioPlayerController