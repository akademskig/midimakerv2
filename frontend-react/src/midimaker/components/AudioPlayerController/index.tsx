import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core'
import { PlayArrow, Stop } from '@material-ui/icons'
import React, { ReactElement, useContext, useState } from 'react'
import classnames from 'classnames'
import styled from 'styled-components'
import { useAudioPlayer } from '../../controllers/AudioPlayer'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { useNotesGridRenderer } from '../NotesGrid/components/NotesGridRenderer'

const SAudioPlayerController = styled.div`
    padding: 0.5em;
    display: flex;
    >:nth-child(1){
        margin-right: 0.5em;
    }
`


const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      height: '100vh',
      justifyContent: 'center',
    },
    button: {
       '&.active': {
           color: 'red'
       }
   }
  }));
function AudioPlayerController(): ReactElement{
    const [active, setActive] = useState('')
    const { playAll, stopPlayAll } = useAudioPlayer()
    const { renderPlay, stopPlayRender } = useNotesGridRenderer()
    const { setControllerState, controllerState } = useContext(AudioStateProviderContext)
    const classes = useStyles()

    const onPlayButtonClick = () => {
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
        <SAudioPlayerController>
            <IconButton onClick={onPlayButtonClick} className={classnames(classes.button, {active: controllerState.PLAYING})}>
                <PlayArrow/>
            </IconButton>
            <IconButton onClick={onStopButtonClick} >
                <Stop/>
            </IconButton>
        </SAudioPlayerController>

    )
}

export default AudioPlayerController