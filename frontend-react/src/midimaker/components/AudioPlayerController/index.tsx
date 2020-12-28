import { IconButton } from '@material-ui/core'
import { PlayArrow, Stop } from '@material-ui/icons'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { useAudioPlayer } from '../../controllers/AudioPlayer'
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
    const { renderPlay } = useNotesGridRenderer()
    const onPlayButtonClick = () => {
        playAll()
        renderPlay()
        setActive('PLAY')
        console.log('I was clicked!')
    }
    const onStopButtonClick =() => {
        stopPlayAll()
        setActive('STOP')
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