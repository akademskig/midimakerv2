import { useCallback, useContext } from 'react'
import { PlayEvent, TChannel } from '../providers/SoundfontProvider/SoundFontProvider.types'
import { SoundfontProviderContext } from '../providers/SoundfontProvider/SoundfontProvider'
import { AudioStateProviderContext } from '../providers/AudioStateProvider/AudioStateProvider'
import { sample } from 'lodash'
import { defaultColors } from '../components/NotesGrid/constants'
import { v4 as uuid } from 'uuid'
class Channel implements TChannel {
    id: string
    instrumentName: string
    notes: PlayEvent[]
    duration: number
    color: string
    constructor(id: string, instrumentName: string, channelColor: string) {
        this.id = id
        this.instrumentName = instrumentName
        this.notes = []
        this.duration = 0
        this.color = channelColor
    }
}

interface IAudioController {
    handleToggleNote: (note: PlayEvent) => void,
    updateNote: (note: PlayEvent) => void,
    switchChannel: (instrumentName: string) => void
    removeChannel: (InstrumentName: string) => void
    addNewChannel: (InstrumentName: string) => void
    selectInstrument: (InstrumentName: string) => void,
    loadInstruments: (channels: TChannel[]) => void
}


function AudioController(): IAudioController {
    const { currentChannel, setChannels, channels, setCurrentChannel } = useContext(AudioStateProviderContext)
    const { currentInstrument, setCurrentInstrumentName, loadInstrument } = useContext(SoundfontProviderContext)
   
    const addNewChannel = useCallback((instrumentName) => {
        const newChannel = new Channel(uuid(), instrumentName, sample(defaultColors) || '')
        setCurrentChannel(newChannel)
        setChannels([...channels, newChannel])
        return newChannel
    }, [channels, setChannels, setCurrentChannel])

    const selectInstrument = useCallback((instrumentName)=> {
        setCurrentInstrumentName(instrumentName)
        addNewChannel(instrumentName)
    }, [addNewChannel, setCurrentInstrumentName])

    const updateChannels = useCallback((updatedChannel: TChannel) => {
        const exists = channels.find(channel => channel.id === updatedChannel.id)
        let newChannels = []
        if (exists) {
            newChannels = channels.map(channel => channel.id === updatedChannel.id ? updatedChannel : channel)
        }
        else {
            newChannels = [...channels, updatedChannel]
        }
        setChannels(newChannels)

    }, [channels, setChannels])

    const addNoteToCurrentChannel = useCallback((note: PlayEvent, currentChannel: TChannel) => {
        if (!currentChannel) {
            return
        }
        const newChannel = {
            ...currentChannel,
            notes: [...currentChannel?.notes, {...note, noteId: `${note.noteId}-${Date.now()}`}],
            duration: (note.time + note.duration) > currentChannel.duration
                ? (note.time + note.duration)
                : currentChannel.duration
        }
        setCurrentChannel(newChannel)
        updateChannels(newChannel)
    }, [setCurrentChannel, updateChannels])

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
    }, [currentChannel, removeNoteFromChannel, updateChannels, setCurrentChannel])

    const handleToggleNote = useCallback((note: PlayEvent) => {
        const channelNote = (currentChannel?.notes || []).find(n=> n.noteId === note.noteId)
        if (
            !currentChannel ||
            !channelNote
        ) {
            let channel = channels.find(channel => channel.instrumentName === currentInstrument?.name)
            if (!channel) {
                channel = addNewChannel(currentInstrument?.name)
            }
            if(channel){
                addNoteToCurrentChannel(note, channel)
            }
            return note
        } else {
            if(channelNote){
                removeNoteFromChannel(channelNote)}
        }

    }, [addNewChannel, addNoteToCurrentChannel, channels, currentChannel, currentInstrument, removeNoteFromChannel])
    const switchChannel = useCallback((channelId: string) => {
        const newChannel = channels.find(channel => channel.id === channelId)
        if(newChannel){
            setCurrentInstrumentName(newChannel.instrumentName)
            setCurrentChannel(newChannel)
        }
    }, [channels, setCurrentChannel, setCurrentInstrumentName])

    const removeChannel = useCallback((channelId: string)=> {
        const newChannels = channels.filter(channel => channel.id !== channelId)
        switchChannel(newChannels[newChannels.length-1]?.id)
        setChannels(newChannels)
    }, [channels, setChannels, switchChannel])

    const loadInstruments = useCallback((channels:TChannel[])=> {
        channels.map(async ({instrumentName}) => {
            return loadInstrument(instrumentName)
        })
        setCurrentChannel(channels[0])
        return setCurrentInstrumentName(channels[0].instrumentName)
    }, [loadInstrument, setCurrentChannel, setCurrentInstrumentName])

    // useEffect(() => {
    //    loadInstruments()
    //    console.log('loading')
    // }, [loadInstruments])

    return ({
        handleToggleNote,
        updateNote,
        switchChannel,
        removeChannel,
        addNewChannel, 
        selectInstrument,
        loadInstruments
    })
}

function useAudioController(): IAudioController {
    return AudioController()
}

export default AudioController
export {
    useAudioController
}
