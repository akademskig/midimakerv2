import { useCallback, useContext } from 'react'
import { PlayEvent, TChannel } from '../providers/SoundfontProvider/SoundFontProvider.types'
import { SoundfontProviderContext } from '../providers/SoundfontProvider/SoundfontProvider'
import { AudioStateProviderContext } from '../providers/AudioStateProvider/AudioStateProvider'

class Channel implements TChannel {
    instrumentName: string
    notes: PlayEvent[]
    duration: number
    color: string
    constructor(instrumentName: string, channelColor: string) {
        this.instrumentName = instrumentName
        this.notes = []
        this.duration = 0
        this.color = channelColor

    }

}

interface IAudioController {
    handleToggleNote: (note: PlayEvent) => void,
    updateNote: (note: PlayEvent) => void,
}


function AudioController(): IAudioController {
    const { currentChannel, setChannels, channels, channelColor, setCurrentChannel } = useContext(AudioStateProviderContext)
    const { currentInstrument } = useContext(SoundfontProviderContext)

    const addNewChannel = useCallback(() => {
        if (!currentInstrument) {
            return
        }
        const newChannel = new Channel(currentInstrument?.name, channelColor)
        setCurrentChannel(newChannel)
        setChannels([...channels, newChannel])
    }, [channelColor, channels, currentInstrument, setChannels, setCurrentChannel])

    
    const updateChannels = useCallback((updatedChannel: TChannel) => {
        const exists = channels.find(channel => channel.instrumentName === updatedChannel.instrumentName)
        let newChannels = []
        if (exists) {
            newChannels = channels.map(channel => channel.instrumentName === updatedChannel.instrumentName ? updatedChannel : channel)
        }
        else {
            newChannels = [updatedChannel]
        }
        setChannels(newChannels)

    }, [channels, setChannels])
    const addNoteToCurrentChannel = useCallback((note: PlayEvent) => {
        if (!currentChannel) {
            return
        }
        const newChannel = {
            ...currentChannel,
            notes: [...currentChannel?.notes, note],
            duration: (note.time + note.duration) > currentChannel.duration
                ? (note.time + note.duration)
                : currentChannel.duration
        }
        setCurrentChannel(newChannel)
        updateChannels(newChannel)
    }, [currentChannel, setCurrentChannel, updateChannels])

    const removeNoteFromChannel = useCallback((channelNote) => {
        if (!currentChannel) {
            return
        }
        const newNotes = currentChannel.notes.filter((note) => note.noteId !== channelNote.noteId)
        const newChannelDuration = newNotes.reduce((acc: number, e: PlayEvent) => acc < e.time + e.duration ? e.time + e.duration : acc, 0)
        const newChannel = {
            ...currentChannel,
            notes: newNotes,
            duration: newChannelDuration
        }
        setCurrentChannel(newChannel)
        updateChannels(newChannel)
    }, [currentChannel, setCurrentChannel, updateChannels])

    const updateNote = useCallback((currentNote: PlayEvent) => {
        if(!currentChannel){
            return
        }
        if(currentNote.duration <= 0){
            return removeNoteFromChannel(currentNote)
        }
        const newNotes = currentChannel.notes.map(note=> note.noteId === currentNote.noteId ? currentNote : note)
        const newChannelDuration = newNotes.reduce((acc: number, e: PlayEvent) => acc < e.time + e.duration ? e.time + e.duration : acc, 0)
        const newChannel = {
            ...currentChannel,
            notes: newNotes,
            duration: newChannelDuration
        }
        setCurrentChannel(newChannel)
        updateChannels(newChannel)
    }, [ currentChannel, removeNoteFromChannel, addNoteToCurrentChannel, updateChannels, setCurrentChannel ])

    const handleToggleNote = useCallback((note: PlayEvent) => {
        const channelNote = (currentChannel?.notes || []).find(n=> n.noteId === note.noteId)
        if (
            !currentChannel ||
            !channelNote
        ) {
            const channel = channels.find(channel => channel.instrumentName === currentChannel?.instrumentName)
            if (!channel) {
                addNewChannel()
            }
            addNoteToCurrentChannel(note)
            return note
        } else {
            if(channelNote){
                removeNoteFromChannel(channelNote)}
        }

    }, [addNewChannel, addNoteToCurrentChannel, channels, currentChannel, removeNoteFromChannel])

    return ({
        handleToggleNote,
        updateNote
    })
}

function useAudioController(): IAudioController {
    return AudioController()
}

export default AudioController
export {
    useAudioController
}
