import React, { createContext, ReactElement, useCallback, useEffect, useState } from 'react'
import { MidiNumbers } from 'react-piano'
import { range } from 'lodash'
import { Note, TChannel } from '../SoundfontProvider/SoundFontProvider.types'

const initialNoteRange = {
    first: 43,
    last: 67,
}
const initialNoteDuration = 0.125
const initialChannelColor = '#008080'

interface IControllerState {
    PLAYING?: boolean
    RECORDING?:boolean,
    RECORDING_RESET?: boolean
}

export type TNoteRange = {
    first: number,
    last: number
}
interface IAudioStateProviderContext {
    currentChannel: TChannel | null;
    setCurrentChannel: React.Dispatch<React.SetStateAction<TChannel | null>>
    setChannelColor: React.Dispatch<React.SetStateAction<string>>
    channels: TChannel[];
    setChannels: React.Dispatch<React.SetStateAction<TChannel[]>>
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>
    noteDuration: number,
    setNoteDuration: React.Dispatch<React.SetStateAction<number>>
    channelColor: string,
    controllerState: IControllerState,
    setControllerState: (state: IControllerState) => void,
    noteRange: TNoteRange,
    setNoteRange: React.Dispatch<React.SetStateAction<TNoteRange>>,
    compositionDuration: number,
    setCompositionDuration: React.Dispatch<React.SetStateAction<number>>,
   
}

interface IAudioStateProviderProps { 
    children: ReactElement | ReactElement[]
}
const initialChannel = {
    instrumentName: '',
    notes: [],
    color: initialChannelColor,
    duration: 0
}
const initialControllerState = {
    PLAYING: false,
    RECORDING: false,
    RECORDING_RESET: false
}

const initialCtxValue = {
        currentChannel: null,
        setCurrentChannel: ((value: React.SetStateAction<TChannel | null>) => (value: TChannel) => value),
        channelColor: '#008080',
        setChannelColor: ((value: React.SetStateAction<string>) => (value: string) => value),
        noteDuration: 0.125,
        setNoteDuration: ((value: React.SetStateAction<number>) => (value: number) => value),
        channels: [],
        setChannels: ((value: React.SetStateAction<TChannel[] | []>) => (value: TChannel[]) => value),
        notes: [],
        controllerState: initialControllerState,
        setControllerState: (state: IControllerState) => {},
        setNotes: ((value: React.SetStateAction<Note[]>) => (value: Note[]) => value),
        noteRange: initialNoteRange,
        setNoteRange: ((value: React.SetStateAction<TNoteRange>) => (value:TNoteRange) => value),
        compositionDuration: 0,
        setCompositionDuration: ((value: React.SetStateAction<number>) => (value: number) => value),
}


export const AudioStateProviderContext = createContext<IAudioStateProviderContext>(initialCtxValue)
const AudioStateProvider = ({ children }: IAudioStateProviderProps): JSX.Element => {
    const [noteRange, setNoteRange] = useState<TNoteRange>(initialNoteRange)
    const [noteDuration, setNoteDuration] = useState<number>(initialNoteDuration)
    const [channelColor, updateColor] = useState<string>(initialChannelColor)
    const [currentChannel, setCurrentChannel] = useState<TChannel | null>(initialChannel)
    const [controllerState, setControllerState] = useState<IControllerState>(initialControllerState)
    const [channels, setChannels] = useState<TChannel[]>([])
    const [compositionDuration, setCompositionDuration] = useState(90)
console.log(compositionDuration, 'duraiton')
    const [ notes, setNotes] = useState(  
        range(noteRange.first, noteRange.last)
        .map((idx: number) => MidiNumbers.getAttributes(idx))
        .reverse())

    useEffect(() => {
        setNotes( range(noteRange.first, noteRange.last)
        .map((idx: number) => MidiNumbers.getAttributes(idx))
        .reverse())
    }, [noteRange])

    const setController = useCallback((state)=> {
        setControllerState({
            ...controllerState,
            ...state
        })
    }, [controllerState])

    const setChannelColor = useCallback(
        (color) => {
            updateColor(color)
            if(!currentChannel){
                return 
            }
            const newChannel = {...currentChannel, color}
            const newChannels = channels.map((channel:TChannel) => 
                channel.instrumentName === currentChannel?.instrumentName ? newChannel : channel)
            setChannels(newChannels)
            setCurrentChannel(newChannel)
        },
        [currentChannel, setCurrentChannel, channels, setChannels, updateColor])

    const ctxValue = {
        currentChannel,
        setCurrentChannel,
        channelColor,
        setChannelColor,
        noteDuration,
        setNoteDuration,
        channels,
        setChannels,
        notes,
        controllerState,
        setControllerState: setController,
        setNotes,
        noteRange, 
        setNoteRange,
        compositionDuration,
        setCompositionDuration
    }

    return (
        <AudioStateProviderContext.Provider value={ctxValue}>
            { children }
        </AudioStateProviderContext.Provider>
    )
}

export default AudioStateProvider
