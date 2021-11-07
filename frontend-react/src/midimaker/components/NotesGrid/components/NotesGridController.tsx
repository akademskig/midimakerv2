import React, {
  createContext,
  MouseEvent,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  MutableRefObject,
  useRef,
  useState,
} from "react"
import useAudioPlayer from "../../../controllers/AudioPlayer"
import { ICoordinates } from "./NotesGridRenderer"
import {
  PlayEvent,
  TChannel,
} from "../../../providers/SoundfontProvider/SoundFontProvider.types"
import { useAudioController } from "../../../controllers/AudioController"
import { AudioStateProviderContext } from "../../../providers/AudioStateProvider/AudioStateProvider"
import { RECT_SPACE, RECT_WIDTH } from "../constants"
import { flatMap, uniqueId } from "lodash"
import { TMappedEvent } from "./NotesGridRenderer"

export interface INotesGridControllerProps {
  children: ReactElement | ReactElement[]
}

export interface INotesGridController {
  toggleNote: (
    event: MouseEvent<HTMLDivElement | HTMLCanvasElement, globalThis.MouseEvent>
  ) => void
  findNoteInChannel: (
    event: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => PlayEvent | undefined
  timer: number
  setTimer: React.Dispatch<React.SetStateAction<number>>
  renderPlay: () => void
  pausePlayRender: () => void
  stopPlayRender: () => void
  setNotesCoordinates: (coordinates: Array<ICoordinates>) => void
  getBlobFromCanvas: () => Promise<Blob | null>
  updateChannels: (channels: TChannel[]) => TChannel[]

  initCtx: (
    canvasElement: HTMLCanvasElement,
    canvasBoxElement: HTMLDivElement,
    notesListElement: HTMLCanvasElement,
    canvasTimerElement: HTMLCanvasElement
  ) => void
}

const initialCtxValues = {
  toggleNote: (
    e: MouseEvent<HTMLDivElement | HTMLCanvasElement, globalThis.MouseEvent>
  ) => {},
  findNoteInChannel: (
    event: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => undefined,
  timer: 0,
  setTimer: (value: React.SetStateAction<number>) => (value: number) => value,
  renderPlay: () => {},
  stopPlayRender: () => {},
  setNotesCoordinates: (coordinates: Array<ICoordinates>) => {},
  pausePlayRender: () => {},
  getBlobFromCanvas: async () => null,
  updateChannels: (channels: TChannel[]) => channels,
  initCtx: (
    canvasElement: HTMLCanvasElement,
    canvasBoxElement: HTMLDivElement,
    notesListElement: HTMLCanvasElement,
    canvasTimer: HTMLCanvasElement
  ) => {},
}
let canvasElementLocal: HTMLCanvasElement | null = null
export const NotesGridControllerCtx =
  createContext<INotesGridController>(initialCtxValues)
function NotesGridControllerProvider({
  children,
}: INotesGridControllerProps): JSX.Element {
  const { playNote } = useAudioPlayer()
  // const { findNoteByGridCoordinates, getX, getY, rectangleHeight } = useContext(CanvasContext)
  const { handleToggleNote } = useAudioController()
  const {
    channels,
    setCurrentChannel,
    setChannels,
    setControllerState,
    noteDuration,
    notes,
  } = useContext(AudioStateProviderContext)
  const [mappedEvents, setMappedEvents] = useState<TMappedEvent[]>([])

  const [timer, setTimer] = useState(0)
  const timers = useRef<number[]>([])
  const stopTimer: MutableRefObject<number> = useRef<number>(0)
  const canvasNotesCoordinates = useRef<Array<ICoordinates>>([])
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(
    null
  )
  const [canvasBoxElement, setCanvasBoxElement] =
    useState<HTMLDivElement | null>(null)

  const [canvasTimerElement, setCanvasTimerElement] =
    useState<HTMLCanvasElement | null>(null)

  const initCtx = useCallback(
    (canvasElement, canvasBoxElement, notesListElement, canvasTimerElement) => {
      canvasElementLocal = canvasElement
      setCanvasElement(canvasElement)
      setCanvasBoxElement(canvasBoxElement)
      setCanvasTimerElement(canvasTimerElement)
    },
    [setCanvasElement, setCanvasBoxElement]
  )
  const getX = useCallback(
    (event: MouseEvent) =>
      event.clientX -
      (canvasBoxElement ? canvasBoxElement.getBoundingClientRect().left : 0),
    [canvasBoxElement]
  )

  const getY = useCallback(
    (event: MouseEvent) =>
      event.clientY -
      (canvasBoxElement ? canvasBoxElement.getBoundingClientRect().top : 0),
    [canvasBoxElement]
  )
  const getRectangleHeight = useCallback(() => {
    if (!canvasElement) {
      return 0
    }
    return (canvasElement.height - RECT_SPACE * notes.length) / notes.length
  }, [canvasElement, notes.length])

  const findNoteInChannel = useCallback(
    (event: MouseEvent) => {
      const currentNote = mappedEvents.find(
        (mappedEvent) =>
          getX(event) < mappedEvent.x + mappedEvent.width &&
          getX(event) >= mappedEvent.x &&
          getY(event) >= mappedEvent.y &&
          getY(event) <= mappedEvent.y + getRectangleHeight()
      )
      const currentChannel = channels.find(
        (channel) => channel.id === currentNote?.channelId
      )
      currentChannel && setCurrentChannel(currentChannel)
      return currentChannel?.notes.find(
        (note) => note.noteId === currentNote?.noteId
      )
    },
    [mappedEvents, channels, setCurrentChannel, getX, getY, getRectangleHeight]
  )
  // updates channel coordinates when duration or note range has changed
  const updateChannels = useCallback(
    (channels: TChannel[]) => {
      if (!canvasElement) {
        return channels
      }
      const rectangleHeight =
        (canvasElement.height - RECT_SPACE * notes.length) / notes.length
      const newChannels = channels.map((channel) => {
        const newNotes = channel.notes.map((note) => {
          if (!note.noteId) {
            note.noteId = uniqueId()
          }
          note.coordX = (note.time * (RECT_WIDTH + RECT_SPACE)) / noteDuration
          const noteIdx = notes.findIndex(
            (noteA) => Number(noteA.midiNumber) === note.midi
          )
          note.coordY = (rectangleHeight + RECT_SPACE) * noteIdx
          return note
        })
        channel.notes = newNotes
        return channel
      })
      return newChannels
    },
    [canvasElement, notes, noteDuration]
  )
  const setNotesCoordinates = useCallback((coordinates) => {
    canvasNotesCoordinates.current = coordinates
  }, [])
  // stop play rendering
  const stopPlayRender = useCallback(() => {
    clearTimeout(stopTimer.current)
    timers.current.forEach((t) => clearTimeout(t))
    setTimer(0)
    setControllerState({ PLAYING: false, PAUSED: false })
  }, [setControllerState])

  const findMappedEvents = useCallback(() => {
    const joinedEvents = flatMap(channels, (channel: TChannel) =>
      channel.notes.map((note) => ({
        ...note,
        color: channel.color,
        channelId: channel.id,
      }))
    )

    const mappedEvents = joinedEvents.map((event, i) => {
      const x = event.coordX
      const y = event.coordY
      const width = Math.floor((event.duration * RECT_WIDTH * 1) / noteDuration)
      return { x, y, width, noteId: event.noteId, channelId: event.channelId }
    })
    setMappedEvents(mappedEvents)
  }, [channels, noteDuration, setMappedEvents])
  const findNoteByGridCoordinates = useCallback(
    (event: React.MouseEvent) => {
      if (!canvasBoxElement || !canvasNotesCoordinates.current) {
        return null
      }
      const x = getX(event)
      const y = getY(event)
      const rectangle = canvasNotesCoordinates.current.find(
        (i) =>
          x >= i.x &&
          x <= i.x + RECT_WIDTH &&
          y >= i.y &&
          y <= i.y + getRectangleHeight()
      )
      if (!rectangle) {
        return null
      }
      const timePoint =
        rectangle.x / (RECT_WIDTH + RECT_SPACE) / (1 / noteDuration)
      const note = {
        noteId: rectangle.noteId,
        midi: rectangle.midiNumber,
        time: timePoint,
        duration: noteDuration,
        coordX: rectangle.x,
        coordY: rectangle.y,
      }
      return note
    },
    [canvasBoxElement, getRectangleHeight, getX, getY, noteDuration]
  )
  const toggleNote = useCallback(
    (event) => {
      event.stopPropagation()
      let channelNote = findNoteInChannel(event)
      if (channelNote) {
        return
      }
      const note = findNoteByGridCoordinates(event)
      if (!note) {
        return
      }
      playNote(note)
      return handleToggleNote(note)
    },
    [findNoteByGridCoordinates, handleToggleNote, playNote, findNoteInChannel]
  )

  const renderPlay = useCallback(() => {
    if (!canvasTimerElement) {
      return
    }
    const compositionDuration = channels.reduce(
      (acc, curr) => (curr.duration > acc ? curr.duration : acc),
      0
    )
    const freq = noteDuration < 0.125 ? noteDuration * 2 : noteDuration
    for (let i = timer; i <= compositionDuration + noteDuration; i += freq) {
      const offsetted = i - timer
      const t = window.setTimeout(() => {
        setTimer(i)
      }, offsetted * 1000)
      timers.current = [...timers.current, t]
    }
    stopTimer.current = window.setTimeout(
      () => stopPlayRender(),
      (compositionDuration - timer) * 1000 +
        (compositionDuration * 500) / compositionDuration
    ) // no lag if duration is 0
  }, [
    canvasTimerElement,
    channels,
    noteDuration,
    stopPlayRender,
    timer,
    setTimer,
  ])

  const pausePlayRender = useCallback(() => {
    clearTimeout(stopTimer.current)
    timers.current.forEach((t) => clearTimeout(t))
    setControllerState({ PLAYING: false })
  }, [setControllerState])

  const getBlobFromCanvas = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
      return canvasElementLocal?.toBlob((blob) => {
        if (blob) {
          return resolve(blob)
        } else {
          return reject(null)
        }
      })
    })
  }, [])

  useEffect(() => {
    findMappedEvents()
  }, [findMappedEvents])
  useEffect(() => {
    setChannels(updateChannels(channels))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChannels, updateChannels])

  const ctxValue = {
    initCtx,
    toggleNote,
    findNoteInChannel,
    timer,
    setTimer,
    renderPlay,
    stopPlayRender,
    setNotesCoordinates,
    pausePlayRender,
    getBlobFromCanvas,
    updateChannels,
  }
  return (
    <NotesGridControllerCtx.Provider value={ctxValue}>
      {children}
    </NotesGridControllerCtx.Provider>
  )
}

export default NotesGridControllerProvider
