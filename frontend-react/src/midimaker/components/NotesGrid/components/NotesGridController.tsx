import React, { createContext, MouseEvent, ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import useAudioPlayer from '../../../controllers/AudioPlayer'
import { ICoordinates } from './NotesGridRenderer'
import { PlayEvent, TChannel } from '../../../providers/SoundfontProvider/SoundFontProvider.types'
import { useAudioController } from '../../../controllers/AudioController'
import { AudioStateProviderContext } from '../../../providers/AudioStateProvider/AudioStateProvider'
import { RECT_SPACE, RECT_WIDTH } from '../constants'
import { flatMap } from 'lodash'
import { TMappedEvent } from './NotesGridRenderer'
export interface INotesGridControllerProps {
  children: ReactElement | ReactElement[]
}

export interface INotesGridController {
  toggleNote: (event: MouseEvent<HTMLDivElement | HTMLCanvasElement, globalThis.MouseEvent>) => void
  findNoteInChannel: (event: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => PlayEvent | undefined,
  timer: number,
  renderPlay: ()=> void,
  stopPlayRender: ()=> void,
  setNotesCoordinates: (coordinates: Array<ICoordinates>) => void
 
  initCtx:(canvasElement: HTMLCanvasElement, canvasBoxElement: HTMLDivElement, notesListElement: HTMLCanvasElement, canvasTimerElement: HTMLCanvasElement)=> void
}

const initialCtxValues = {
  toggleNote: (e: MouseEvent<HTMLDivElement | HTMLCanvasElement, globalThis.MouseEvent>) => {},
  findNoteInChannel: (event: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => undefined,
  timer: 0,
  renderPlay: ()=> {},
  stopPlayRender: ()=> {},
  setNotesCoordinates: (coordinates: Array<ICoordinates>) => {},
  initCtx:(canvasElement: HTMLCanvasElement, canvasBoxElement: HTMLDivElement, notesListElement: HTMLCanvasElement, canvasTimer: HTMLCanvasElement)=> {},
}

export const NotesGridControllerCtx= createContext<INotesGridController>(initialCtxValues)
function NotesGridControllerProvider({ children }: INotesGridControllerProps): JSX.Element {
  const { playNote } = useAudioPlayer()
  // const { findNoteByGridCoordinates, getX, getY, rectangleHeight } = useContext(CanvasContext)
  const { handleToggleNote } = useAudioController()
  const { currentChannel, channels,  setControllerState, noteDuration, notes } = useContext(AudioStateProviderContext)
  const [mappedEvents, setMappedEvents ] = useState<TMappedEvent[]>([])

  const [timer, setTimer] = useState(0)
  const timers = useRef<Array<number>>([])
  const canvasNotesCoordinates = useRef<Array<ICoordinates>>([])
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
  const [canvasBoxElement, setCanvasBoxElement] = useState<HTMLDivElement | null>(null)
  const [ notesListElement, setNotesListElement] = useState<HTMLCanvasElement | null>(null)
  const [canvasTimerElement, setCanvasTimerElement] = useState<HTMLCanvasElement | null>(null)

  const initCtx = useCallback((canvasElement, canvasBoxElement, notesListElement, canvasTimerElement)=> {
    setCanvasElement(canvasElement)
    setCanvasBoxElement(canvasBoxElement)
    setNotesListElement(notesListElement)
    setCanvasTimerElement(canvasTimerElement)
  }, [setCanvasElement, setCanvasBoxElement, setNotesListElement ])
  const getX = useCallback((event: MouseEvent) =>
    event.clientX - (canvasBoxElement ? canvasBoxElement.getBoundingClientRect().left : 0), [canvasBoxElement])
  
  const getY = useCallback((event: MouseEvent) =>
    event.clientY - (canvasBoxElement ? canvasBoxElement.getBoundingClientRect().top : 0), [ canvasBoxElement])
    const getRectangleHeight = useCallback(()=> {
      if(!canvasElement){
        return 0
      }
      return  (canvasElement.height - RECT_SPACE * notes.length) / notes.length
    }, [canvasElement, notes.length])
  const findNoteInChannel = useCallback((event: MouseEvent)=> {
    const currentNote = mappedEvents.find(mappedEvent => mappedEvent.instrumentName === currentChannel?.instrumentName && (getX(event) < mappedEvent.x + mappedEvent.width && getX(event) >= mappedEvent.x) &&
     (getY(event) >= mappedEvent.y && getY(event)<= mappedEvent.y + getRectangleHeight()))
    return currentChannel?.notes.find(note=> note.noteId === currentNote?.noteId)
  }, [mappedEvents, currentChannel, getX, getY, getRectangleHeight])

  const setNotesCoordinates = useCallback((coordinates)=> {
    canvasNotesCoordinates.current=coordinates
  }, [])
  // stop play rendering
  const stopPlayRender = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    setTimer(0)
    setControllerState({'PLAYING': false})
  }, [setTimer, setControllerState])
 
  const findMappedEvents = useCallback(() => {
    const joinedEvents = flatMap(channels, (channel: TChannel) =>
      channel.notes.map((note) => ({ ...note, color: channel.color, instrumentName: channel.instrumentName })))

    const mappedEvents = joinedEvents.map((event, i) => {
      const x = event.coordX
      const y = event.coordY
      const width = Math.floor(
        event.duration * RECT_WIDTH * 1/noteDuration
      )
      return {x, y, width, noteId: event.noteId, instrumentName: event.instrumentName }
    })
    setMappedEvents(mappedEvents)

  }, [channels, noteDuration, setMappedEvents])
  const findNoteByGridCoordinates = useCallback((event: React.MouseEvent) => {
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
      const timePoint =  (rectangle.x) / (RECT_WIDTH  + RECT_SPACE) / (1/noteDuration)
      const note = {
        noteId: rectangle.noteId,
        midiNumber: rectangle.midiNumber,
        time: timePoint,
        duration: noteDuration,
        coordX: rectangle.x,
        coordY: rectangle.y
      }
      return note
    }, [canvasBoxElement, getRectangleHeight, getX, getY, noteDuration])
    const toggleNote = useCallback(
      (event) => {
        event.stopPropagation()
        let channelNote = findNoteInChannel(event)
        if(channelNote){
          return 
        }
        const note = findNoteByGridCoordinates(event)
        if(!note){
          return
        }
        playNote(note)
        return handleToggleNote(note)
      },
      [findNoteByGridCoordinates, handleToggleNote, playNote, findNoteInChannel]
    )

  const renderPlay = useCallback(() => {
    if(!canvasTimerElement){
      return 
    }
    const compositionDuration = channels.reduce(
      (acc, curr) => (curr.duration > acc ? curr.duration : acc),
      0)
    for (let i = 0; i <= compositionDuration + noteDuration; i += noteDuration ) {
      const t = setTimeout(() => {
        setTimer(i)
      }, i * 1000)
      timers.current = [...timers.current, t]
    }
    setTimeout(() => stopPlayRender(), compositionDuration * 1000 +
       (compositionDuration * 500 /compositionDuration)) // no lag if duration is 0
  }, [canvasTimerElement, channels, noteDuration, stopPlayRender])

  useEffect(() => {
    findMappedEvents()
  }, [findMappedEvents])
  const ctxValue = {
    initCtx,
    toggleNote,
    findNoteInChannel,
    timer,
    renderPlay,
    stopPlayRender,
    setNotesCoordinates,
  }
  return(
    <NotesGridControllerCtx.Provider value={ctxValue}>
      {children}
    </NotesGridControllerCtx.Provider>
  )
}

export default NotesGridControllerProvider