import React from 'react'
import SoundfontProvider from '../providers/SoundfontProvider/SoundfontProvider'
import AudioStateProvider from '../providers/AudioStateProvider/AudioStateProvider'
import AudioPlayerController from '../components/AudioPlayerController'
import AudioSettingsController from '../components/AudioSettingsController'
import ChannelsController from '../components/ChannelsController'
import NotesGridRenderer from '../components/NotesGrid/components/NotesGridRenderer'
import NotesGridControllerProvider from '../components/NotesGrid/components/NotesGridController'
const NewMidi = () => {

    return (
        <SoundfontProvider>
            <AudioStateProvider>
                {/* <div style={{height: `${height}-64`, width: `${width-200}px`}}> */}
                <NotesGridControllerProvider>
                    <AudioPlayerController top/>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%', flexGrow: 1}}>
                        <AudioSettingsController left/>
                        <NotesGridRenderer />
                        <ChannelsController/>
                    </div>
                    <AudioPlayerController/>
                </NotesGridControllerProvider>
                {/* </div> */}
            </AudioStateProvider>
        </SoundfontProvider>
    )
}

export default NewMidi