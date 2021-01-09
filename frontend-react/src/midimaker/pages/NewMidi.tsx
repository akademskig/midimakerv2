import React from 'react'
import SoundfontProvider from '../providers/SoundfontProvider/SoundfontProvider'
import NotesGrid from '../components/NotesGrid/NotesGrid'
import AudioStateProvider from '../providers/AudioStateProvider/AudioStateProvider'
import AudioPlayerController from '../components/AudioPlayerController'
import AudioSettingsController from '../components/AudioSettingsController'
import useScreenSize from '../../providers/screenSize.provider'
import ChannelsController from '../components/ChannelsController'
const NewMidi = () => {

    const { height, width } = useScreenSize()
    return (
        <SoundfontProvider>
            <AudioStateProvider>
                {/* <div style={{height: `${height}-64`, width: `${width-200}px`}}> */}
                <AudioPlayerController top/>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', flexGrow: 1}}>
                    <AudioSettingsController left/>
                    <NotesGrid />
                    <ChannelsController/>
                </div>
                <AudioPlayerController/>
                {/* </div> */}
            </AudioStateProvider>
        </SoundfontProvider>
    )
}

export default NewMidi