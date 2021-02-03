import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, makeStyles, TextField, Theme } from '@material-ui/core'
import { Save, LayersClearSharp, FolderOpenOutlined, CloudUpload } from '@material-ui/icons'
import React, { ReactElement, useContext, useState, useCallback } from 'react'
import { sample } from 'lodash'
import { DropzoneDialog } from 'material-ui-dropzone'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { NotesGridControllerCtx } from '../NotesGrid/components/NotesGridController'
import useMidiFileApi from '../../../api/protected/midiFile'
import useNotify from '../../../components/common/notifications/notifications'
import { CustomTooltip } from '../shared/loader/CustomTooltip'
import { defaultColors } from '../NotesGrid/constants'
import { TChannel } from '../../providers/SoundfontProvider/SoundFontProvider.types'
import { useAudioController } from '../../controllers/AudioController'

type TMidiFile = {
    name: string,
    id: string
}
const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        display: 'flex',
        padding: '0.5em',
        height: '61px',
        width: '100%',
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
            '& svg': {
                color: theme.palette.secondary.light
            }
        },
    },
    fileList: {
        maxHeight: '300px',
        overflowY: 'auto'
    }
}))

function FsController(): ReactElement {
    // const { renderPlay, stopPlayRender } = useContext(CanvasContext)
    const { channels, setChannels, updateGridSetup, setAudioStateLoading } = useContext(AudioStateProviderContext)
    const { updateChannels } = useContext(NotesGridControllerCtx)
    const { saveMidiFile, getFilenames, getMidiFile, updateMidiFile, uploadFile } = useMidiFileApi()
    const notify = useNotify()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)
    const [selectFileOpen, setSelectFileOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<TMidiFile | null>(null)
    const [files, setFiles] = useState<TMidiFile[]>([])
    const [midiName, setMidiName] = useState('test')
    const { loadInstruments } = useAudioController()

    const onSaveClick = useCallback(async () => {
        if (selectedFile) {
            updateMidiFile({ ...selectedFile, midiChannels: channels })
                .then(res => notify('success', 'Midi saved.'))
                .catch(error => notify('error', 'An error occurred.'))
        }
        else {
            setOpen(true)
        }
    }, [selectedFile, updateMidiFile, channels, notify])

    const onNameSetClick = useCallback(async () => {
        saveMidiFile({ name: midiName, midiChannels: channels })
            .then(({ id, name, midiChannels }) => {
                setSelectedFile({ id, name })
                setChannels(midiChannels)
                notify('success', 'Midi saved.')
                setOpen(false)
            })
            .catch(error => notify('info', error.message))
    }, [saveMidiFile, midiName, channels, setChannels, notify])

    const onSelectFileClick = useCallback(
        async () => {
            const files = await getFilenames()
            setFiles(files)
            setSelectFileOpen(true)
        },
        [getFilenames],
    )
    const onFileSelectClick = useCallback(
        async (file) => {
            setAudioStateLoading(true)
            setSelectFileOpen(false)
            const { midiChannels } = await getMidiFile({ id: file.id })
            if (midiChannels) {
                const channels = midiChannels.map((d: TChannel) => ({ ...d, color: sample(defaultColors) }))
                const updatedChannels = updateChannels(channels)
                loadInstruments(channels)
                setChannels(updatedChannels)
                updateGridSetup(channels)
                setSelectedFile(file)
            }
            setAudioStateLoading(false)
        },
        [getMidiFile, loadInstruments, setAudioStateLoading, setChannels, updateChannels, updateGridSetup],
    )

    const onUploadFileClick = useCallback(() => {
        setUploadOpen(true)
    }, [])

    const onUploadFileDone = useCallback(async (files: any[]) => {
        setUploadOpen(false)
        if (files.length > 0) {
            setAudioStateLoading(true)
            uploadFile(files[0]).then(data=> {
                const channels = data.map((d: TChannel) => ({ ...d, color: sample(defaultColors) }))
                loadInstruments(channels)
                setChannels(updateChannels(channels))
                updateGridSetup(channels)
            })
            .catch(error=> notify('error', 'An error occurred. Midi file may not be valid.'))
            .finally(() => {
                setAudioStateLoading(false)
            })
        }
    }, [loadInstruments, notify, setAudioStateLoading, setChannels, updateChannels, updateGridSetup, uploadFile])

    const onNewMidiClick = useCallback(() => {
        setChannels([])
        setSelectedFile(null)
    }, [setChannels])

    return (
        <>
            <div className={classes.container}>
                <Button className={classes.button}>
                    {selectedFile?.name || ''}
                </Button>
                <CustomTooltip title={'UploadFile'} placement='top-end' >
                    <IconButton onClick={onUploadFileClick} className={classes.button}>
                        <CloudUpload />
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title={'Save'} placement='top-end' >
                    <IconButton onClick={onSaveClick} className={classes.button}>
                        <Save />
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title={'Load from database'} placement='top-end' >
                    <IconButton onClick={onSelectFileClick} className={classes.button}>
                        <FolderOpenOutlined />
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title={'Clear grid'} placement='top-end' >
                    <IconButton onClick={onNewMidiClick} className={classes.button}>
                        <LayersClearSharp />
                    </IconButton>
                </CustomTooltip>
            </div>
            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
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
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                                </Button>
                    <Button onClick={() => onNameSetClick()} color="primary">
                        OK
                                </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={selectFileOpen} onClose={() => setSelectFileOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Select file...</DialogTitle>
                <DialogContent>
                    <List className={classes.fileList}>
                        {files.map(file =>
                            <ListItem>
                                <Button onClick={() => onFileSelectClick(file)} color="secondary">
                                    {file.name}
                                </Button>
                            </ListItem>

                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectFileOpen(false)} color="primary">
                        Cancel
                                </Button>
                </DialogActions>
            </Dialog>
            <DropzoneDialog
                onSave={onUploadFileDone}
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                maxFileSize={10000000}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Upload File</DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectFileOpen(false)} color="primary">
                        Cancel
                                </Button>
                </DialogActions>
            </DropzoneDialog>
        </>

    )
}

export default FsController