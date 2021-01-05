import React, { createContext, ReactElement, useCallback, useMemo, useState } from 'react'
import { MidiNumbers } from 'react-piano'
import { range } from 'lodash'
import { Note, TChannel } from '../SoundfontProvider/SoundFontProvider.types'
import { TNoteRange, TRecordingGrid } from './AudioStateProvider.types'
import { TMappedEvent } from '../../components/NotesGrid/components/NotesGridRenderer'

const initialNoteRange = {
    first: 43,
    last: 67,
}
const initialNoteDuration = 0.125
const initialChannelColor = '#008080'
const initailGridNotes: TRecordingGrid = {
    events: [],
    currentTime: 0
}
interface IControllerState {
    PLAYING?: boolean
    RECORDING?:boolean,
    RECORDING_RESET?: boolean
}

interface IAudioStateProviderContext {
    currentChannel: TChannel | null;
    setCurrentChannel: React.Dispatch<React.SetStateAction<TChannel | null>>
    setChannelColor: React.Dispatch<React.SetStateAction<string>>
    channels: TChannel[];
    setChannels: React.Dispatch<React.SetStateAction<TChannel[]>>
    notes: Note[];
    noteDuration: number,
    setNoteDuration: React.Dispatch<React.SetStateAction<number>>
    channelColor: string,
    controllerState: IControllerState,
    setControllerState: (state: IControllerState) => void,
    gridNotes: TRecordingGrid,
    setGridNotes: React.Dispatch<React.SetStateAction<TRecordingGrid>>
    mappedEvents: TMappedEvent[],
    setMappedEvents: React.Dispatch<React.SetStateAction<TMappedEvent[]>>
}

interface IAudioStateProviderProps { 
    children: ReactElement | ReactElement[]
}
const initialChannel = {
    instrumentName: 'acoustic_grand_piano',
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
        gridNotes: initailGridNotes,
        setGridNotes: ((value: React.SetStateAction<TRecordingGrid>) => (value: TRecordingGrid) => value),
        mappedEvents: [],
        setMappedEvents: ((value: React.SetStateAction<TMappedEvent[]>) => (value:TMappedEvent[]) => value),
}


export const AudioStateProviderContext = createContext<IAudioStateProviderContext>(initialCtxValue)
const AudioStateProvider = ({ children }: IAudioStateProviderProps): JSX.Element => {
    const [noteRange, setNoteRange] = useState<TNoteRange>(initialNoteRange)
    const [noteDuration, setNoteDuration] = useState<number>(initialNoteDuration)
    const [channelColor, updateColor] = useState<string>(initialChannelColor)
    const [currentChannel, setCurrentChannel] = useState<TChannel | null>(initialChannel)
    const [controllerState, setControllerState] = useState<IControllerState>(initialControllerState)
    const [mappedEvents, setMappedEvents ] = useState<TMappedEvent[]>([])
    const [channels, setChannels] = useState<TChannel[]>([])
    const [gridNotes, setGridNotes] = useState(initailGridNotes)
    const setController = useCallback((state)=> {
        setControllerState({
            ...controllerState,
            ...state
        })
    }, [controllerState])

    const setChannelColor = useCallback(
        (color) => {
            updateColor(color)
            currentChannel && setCurrentChannel({...currentChannel, color})
            const newChannels = channels.map((channel:TChannel) => 
                channel.instrumentName === currentChannel?.instrumentName ? currentChannel : channel)
            setChannels(newChannels)
           
        },
        [currentChannel, channelColor, setCurrentChannel, channels, setChannels],
    )
    const notes = useMemo(() =>
        range(noteRange.first, noteRange.last)
            .map((idx: number) => MidiNumbers.getAttributes(idx))
            .reverse(), [noteRange.first, noteRange.last])

    const ctxValue = useMemo(() => ({
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
        gridNotes,
        setGridNotes,
        mappedEvents,
        setMappedEvents
    }), [channelColor, setChannelColor, channels, controllerState, currentChannel, gridNotes, noteDuration, notes, mappedEvents])

    return (
        <AudioStateProviderContext.Provider value={ctxValue}>
            { children }
        </AudioStateProviderContext.Provider>
    )
}

export default AudioStateProvider
