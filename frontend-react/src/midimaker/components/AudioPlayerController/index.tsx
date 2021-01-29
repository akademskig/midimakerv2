import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, makeStyles, TextField, Theme } from '@material-ui/core'
import { Pause, PlayArrow, Save, Stop, AttachFile, CreateNewFolderOutlined, CreateNewFolderRounded, LayersClearSharp, FolderOpenOutlined, CloudUpload } from '@material-ui/icons'
import React, { ReactElement, useContext, useState, useCallback } from 'react'
import { sample } from 'lodash'
import { DropzoneArea, DropzoneDialog } from 'material-ui-dropzone'
import classnames from 'classnames'
import { useAudioPlayer } from '../../controllers/AudioPlayer'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { NotesGridControllerCtx } from '../NotesGrid/components/NotesGridController'
import useMidiFileApi from '../../../api/protected/midiFile'
import useNotify from '../../../components/common/notifications/notifications'
import { CustomTooltip } from '../shared/loader/CustomTooltip'
import { defaultColors } from '../NotesGrid/constants'
import { TChannel } from '../../providers/SoundfontProvider/SoundFontProvider.types'
import FsController from '../FsController'

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

function AudioPlayerController({ top = false }): ReactElement {
    const { playAll, stopPlayAll } = useAudioPlayer()
    // const { renderPlay, stopPlayRender } = useContext(CanvasContext)
    const { setControllerState, controllerState } = useContext(AudioStateProviderContext)
    const { renderPlay, stopPlayRender, pausePlayRender } = useContext(NotesGridControllerCtx)
    const classes = useStyles()

    const onPlayButtonClick = () => {
        if (controllerState.PLAYING) {
            return
        }
        playAll()
        renderPlay()
        setControllerState({ 'PLAYING': true, 'PAUSED': false })
    }
    const onStopButtonClick = () => {
        stopPlayAll()
        stopPlayRender()
        setControllerState({ 'PLAYING': false, 'PAUSED': false })
    }
    const onPauseButtonClick = () => {
        if (!controllerState.PLAYING) {
            return
        }
        pausePlayRender()
        stopPlayAll()
        setControllerState({ 'PLAYING': false, 'PAUSED': true })
    }

    return (
        <div className={classes.container}>
            {
                top &&
                <>
                    <div className={classes.audioControlButtons}>
                        <IconButton onClick={onPlayButtonClick} className={classnames(classes.button, { active: controllerState.PLAYING })}>
                            <PlayArrow />
                        </IconButton>
                        <IconButton onClick={onPauseButtonClick} className={classnames(classes.button, { active: controllerState.PAUSED })}>
                            <Pause />
                        </IconButton>
                        <IconButton onClick={onStopButtonClick} className={classes.button}>
                            <Stop />
                        </IconButton>
                    </div>
                    <div className={classes.dbControlButtons}>
                        <FsController/>
                    </div>
                </>
            }
        </div>

    )
}

export default AudioPlayerController