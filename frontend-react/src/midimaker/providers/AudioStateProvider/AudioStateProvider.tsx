import React, { createContext, ReactElement, useCallback, useEffect, useState } from 'react'
import { MidiNumbers } from 'react-piano'
import { v4 as uuid } from 'uuid'
import { range } from 'lodash'
import { Note, TChannel } from '../SoundfontProvider/SoundFontProvider.types'
const initialNoteRange = {
    first: 43,
    last: 67,
}
const initialNoteDuration = 0.125
const initialChannelColor = '#008080'
const initialCompositionDuration = 90

interface IControllerState {
    PLAYING?: boolean
    RECORDING?: boolean,
    PAUSED?: boolean,
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
    resetGrid: () => void,
    updateGridSetup: (channels: TChannel[]) => void,
    audioStateLoading: boolean,
    setAudioStateLoading:React.Dispatch<React.SetStateAction<boolean>>
}

interface IAudioStateProviderProps {
    children: ReactElement | ReactElement[]
}
const initialChannel = {
    id: uuid(),
    instrumentName: '',
    notes: [],
    color: initialChannelColor,
    duration: 0
}
const initialControllerState = {
    PLAYING: false,
    PAUSED: false,
    RECORDING: false,
    RECORDING_RESET: false
}

const initialCtxValue = {
    currentChannel: null,
    setCurrentChannel: ((value: React.SetStateAction<TChannel | null>) => (value: TChannel) => value),
    audioStateLoading: false,
    setAudioStateLoading: ((value: React.SetStateAction<boolean>) => (value: boolean) => value),
    channelColor: '#008080',
    setChannelColor: ((value: React.SetStateAction<string>) => (value: string) => value),
    noteDuration: 0.125,
    setNoteDuration: ((value: React.SetStateAction<number>) => (value: number) => value),
    channels: [],
    setChannels: ((value: React.SetStateAction<TChannel[] | []>) => (value: TChannel[]) => value),
    notes: [],
    controllerState: initialControllerState,
    setControllerState: (state: IControllerState) => { },
    setNotes: ((value: React.SetStateAction<Note[]>) => (value: Note[]) => value),
    noteRange: initialNoteRange,
    setNoteRange: ((value: React.SetStateAction<TNoteRange>) => (value: TNoteRange) => value),
    compositionDuration: 0,
    setCompositionDuration: ((value: React.SetStateAction<number>) => (value: number) => value),
    resetGrid: () => { },
    updateGridSetup: (channels: TChannel[]) => {}
}


export const AudioStateProviderContext = createContext<IAudioStateProviderContext>(initialCtxValue)
const AudioStateProvider = ({ children }: IAudioStateProviderProps): JSX.Element => {
    const [noteRange, setNoteRange] = useState<TNoteRange>(initialNoteRange)
    const [noteDuration, setNoteDuration] = useState<number>(initialNoteDuration)
    const [channelColor, updateColor] = useState<string>(initialChannelColor)
    const [currentChannel, setCurrentChannel] = useState<TChannel | null>(initialChannel)
    const [controllerState, setControllerState] = useState<IControllerState>(initialControllerState)
    const [channels, setChannels] = useState<TChannel[]>([])
    const [compositionDuration, setCompositionDuration] = useState(initialCompositionDuration)
    const [ audioStateLoading, setAudioStateLoading ] = useState<boolean>(false)
    const updateGridSetup = useCallback(channels => {
        const compositionDuration = channels.reduce(
            (acc: number, curr: TChannel) => (curr.duration > acc ? curr.duration : acc),
            0)
        const noteRange = channels.map((channel: TChannel) => {
            return channel.notes.reduce((prev: any, curr: any) => {
                return {
                    min: curr.midi < prev.min ? curr.midi : prev.min,
                    max: curr.midi > prev.max ? curr.midi : prev.max
                }

            }, { min: 108, max: 0 })
        })
        const reduced = noteRange.reduce((prev: any, curr: any) => {
                return {
                    min: curr.min < prev.min ? curr.min : prev.min,
                    max: curr.max > prev.max ? curr.max : prev.max
                }
            }, { min: 108, max: 0 })
        setNoteRange({ first: reduced.min, last: reduced.max})
        setCompositionDuration(compositionDuration)
    }, [])
    const [notes, setNotes] = useState(
        range(noteRange.first, noteRange.last)
            .map((idx: number) => MidiNumbers.getAttributes(idx))
            .reverse())

    useEffect(() => {
        setNotes(range(noteRange.first, noteRange.last)
            .map((idx: number) => MidiNumbers.getAttributes(idx))
            .reverse())
    }, [noteRange])

    const setController = useCallback((state) => {
        setControllerState({
            ...controllerState,
            ...state
        })
    }, [controllerState])

    const setChannelColor = useCallback(
        (color) => {
            updateColor(color)
            if (!currentChannel) {
                return
            }
            const newChannel = { ...currentChannel, color }
            const newChannels = channels.map((channel: TChannel) =>
                channel.instrumentName === currentChannel?.instrumentName ? newChannel : channel)
            setChannels(newChannels)
            setCurrentChannel(newChannel)
        },
        [currentChannel, setCurrentChannel, channels, setChannels, updateColor])

    const resetGrid = useCallback(() => {
        console.log('reseting')
        setNoteRange(initialNoteRange)
        setCompositionDuration(initialCompositionDuration)
        setNoteDuration(initialNoteDuration)
    }, [])
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
        setCompositionDuration,
        resetGrid,
        updateGridSetup,
        audioStateLoading,
        setAudioStateLoading
    }

    return (
        <AudioStateProviderContext.Provider value={ctxValue}>
            { children}
        </AudioStateProviderContext.Provider>
    )
}

export default AudioStateProvider
