import React from 'react'
import SoundfontProvider from '../providers/SoundfontProvider/SoundfontProvider'
import NotesGrid from '../components/NotesGrid/NotesGrid'
import AudioStateProvider from '../providers/AudioStateProvider/AudioStateProvider'
import AudioPlayerController from '../components/AudioPlayerController'
const NewMidi = () => {
    return (
        <SoundfontProvider>
            <AudioStateProvider>
                <AudioPlayerController/>
                <NotesGrid />
            </AudioStateProvider>
        </SoundfontProvider>
    )
}

export default NewMidi