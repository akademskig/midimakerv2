import { IconButton } from '@material-ui/core'
import { PlayArrow, Stop } from '@material-ui/icons'
import React, { ReactElement, useContext, useState } from 'react'
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
function AudioPlayerController(): ReactElement{
    const [active, setActive] = useState('')
    const { playAll, stopPlayAll } = useAudioPlayer()
    const { renderPlay, stopPlayRender } = useNotesGridRenderer()
    const { setControllerState } = useContext(AudioStateProviderContext)

    const onPlayButtonClick = () => {
        playAll()
        renderPlay()
        setActive('PLAY')
        setControllerState({'PLAYING': true})
        console.log('I was clicked!')
    }
    const onStopButtonClick =() => {
        stopPlayAll()
        stopPlayRender()
        setActive('STOP')
        setControllerState({'PLAYING': false})
        console.log('I was clicked!')
    }
    return(
        <SAudioPlayerController>
            <IconButton onClick={onPlayButtonClick} >
                <PlayArrow/>
            </IconButton>
            <IconButton onClick={onStopButtonClick} >
                <Stop/>
            </IconButton>
        </SAudioPlayerController>

    )
}

export default AudioPlayerController