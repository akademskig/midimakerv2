import React from 'react'
import SoundfontProvider from '../providers/SoundfontProvider/SoundfontProvider'
import NotesGrid from '../components/NotesGrid/NotesGrid'
import AudioStateProvider from '../providers/AudioStateProvider/AudioStateProvider'
import AudioPlayerController from '../components/AudioPlayerController'
import AudioSettingsController from '../components/AudioSettingsController'
const NewMidi = () => {
    return (
        <SoundfontProvider>
            <AudioStateProvider>
                <AudioPlayerController top/>
                <div style={{display: 'flex', flexDirection: 'row', width: 'inherit'}}>
                    <AudioSettingsController left/>
                    <NotesGrid />
                    <AudioSettingsController/>
                </div>
                <AudioPlayerController/>
            </AudioStateProvider>
        </SoundfontProvider>
    )
}

export default NewMidi