import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core'
import { Pause, PlayArrow, Stop } from '@material-ui/icons'
import React, { ReactElement, useContext } from 'react'
import classnames from 'classnames'
import { useAudioPlayer } from '../../controllers/AudioPlayer'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { NotesGridControllerCtx } from '../NotesGrid/components/NotesGridController'

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
      display: 'flex',
      padding: '0.5em',
      height: '61px',
      width :'100%',
      backgroundColor: theme.palette.primary.main,
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
    }
   }
  }))

function AudioPlayerController({ top = false}): ReactElement{
    const { playAll, stopPlayAll } = useAudioPlayer()
    // const { renderPlay, stopPlayRender } = useContext(CanvasContext)
    const { setControllerState, controllerState } = useContext(AudioStateProviderContext)
    const { renderPlay, stopPlayRender, pausePlayRender } = useContext(NotesGridControllerCtx)
    const classes = useStyles()
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
    return(
        <>
        <div className={classes.container}>
            {
                top && 
                <>
            <IconButton onClick={onPlayButtonClick} className={classnames(classes.button, {active: controllerState.PLAYING})}>
                <PlayArrow/>
            </IconButton>
            <IconButton onClick={onPauseButtonClick} className={classnames(classes.button, {active: controllerState.PAUSED})}>
                <Pause/>
            </IconButton>
            <IconButton onClick={onStopButtonClick} className={classes.button}>
                <Stop/>
            </IconButton>
            </>
            }
        </div>
        </>

    )
}

export default AudioPlayerController