import { createStyles, Divider, IconButton, makeStyles, Theme } from '@material-ui/core'
import { PlayArrow, Stop } from '@material-ui/icons'
import React, { ReactElement, useContext, useState } from 'react'
import classnames from 'classnames'
import { useAudioPlayer } from '../../controllers/AudioPlayer'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { useNotesGridRenderer } from '../NotesGrid/components/NotesGridRenderer'

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
      display: 'flex',
      padding: '0.5em',
      height: '61px',
      width :'100%',
      backgroundColor: theme.palette.primary.main,
    },
    button: {
        padding: '0.2em 0.5em',
       '&.active': {
           color: 'red'
       }
   }
  }))

function AudioPlayerController({ top = false}): ReactElement{
    const [active, setActive] = useState('')
    const { playAll, stopPlayAll } = useAudioPlayer()
    const { renderPlay, stopPlayRender } = useNotesGridRenderer()
    const { setControllerState, controllerState } = useContext(AudioStateProviderContext)
    const classes = useStyles()

    const onPlayButtonClick = () => {
        if(controllerState.PLAYING){
            return
        }
        playAll()
        renderPlay()
        setControllerState({'PLAYING': true})
    }
    const onStopButtonClick =() => {
        stopPlayAll()
        stopPlayRender()
        setControllerState({'PLAYING': false})
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
            <IconButton onClick={onStopButtonClick} >
                <Stop/>
            </IconButton>
            </>
            }
        </div>
        </>

    )
}

export default AudioPlayerController