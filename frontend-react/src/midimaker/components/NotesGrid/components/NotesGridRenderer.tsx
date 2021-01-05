import {
  createRef,
  useCallback,
  useRef,
  useState,
  useEffect,
  RefObject,
  useContext,
  MouseEvent
} from 'react'

import { flatMap } from 'lodash'

import {
  RECT_WIDTH, RECT_SPACE, RECT_TIME, RECORDING_BAR_COLOR, BAR_COLOR,
  BAR_WIDTH, RECT_COLOR, CANVAS_BACKGROUND, MIDI_OFFSET
} from '../constants'
import { ICoordinates } from '../NotesGrid'
import { Note, PlayEvent, TChannel } from '../../../providers/SoundfontProvider/SoundFontProvider.types'
import { AudioStateProviderContext } from '../../../providers/AudioStateProvider/AudioStateProvider'
import useScreenSize from '../../../../providers/screenSize.provider'
import { lightenDarkenColor } from './utils'


let rectangleHeight = 30

export type TMappedEvent = {
  noteId: string,
  y:number,
  x:number,
  width: number
}
interface IController {
  recording: boolean;
  playing: boolean;
  resetRecording: boolean;
}
interface IControllerInput {
  recording?: boolean;
  playing?: boolean;
  resetRecording?: boolean;
}
export interface INotesGridRendererProps {
  controller: IController;
  setController: (ctrl: IControllerInput) => void;
  recording: {
    currentTime: number;
  };
  absTime: number;
}
export interface INotesGridRenderer {
  canvasBoxRef: RefObject<HTMLDivElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  rectangleHeight: number,
  coordinatesMapRef: RefObject<ICoordinates[]>,
  canvasTimeUnit: number,
  renderPlay: () => void
  stopPlayRender: () => void,
  findNoteByGridCoordinates: (event: React.MouseEvent) => PlayEvent | null,
  findMappedEvents: () => void,
  getX: (event: MouseEvent) => number,
  getY: (event: MouseEvent) => number,
  setHoveredNote: (event: PlayEvent | null) => void,
}

let canvasBoxElement: HTMLDivElement
let canvasElement: HTMLCanvasElement
let coordinatesMapLocal: ICoordinates[]
let notesListWidth = 0
let compositionDuration = 0
let canvasCtx: CanvasRenderingContext2D | null = null
let hoveredNote: PlayEvent | null = null

function NotesGridRenderer(): INotesGridRenderer {

  const [timer, setTimer] = useState(0)
  const { width } = useScreenSize()
  const [canvasTimeUnit, setCanvasTimeUnit] = useState(RECT_TIME)
  const canvasRef = createRef<HTMLCanvasElement>()
  const canvasBoxRef = createRef<HTMLDivElement>()
  const fontSize = useRef<number>(0)
  const [hoveredNoteState, setHoveredNoteState] = useState<PlayEvent | null>(hoveredNote)
  const timers = useRef<Array<number>>([])
  const coordinatesMapRef = useRef<Array<ICoordinates>>([])
  const { channels, setChannels, noteDuration, channelColor, notes, controllerState, setControllerState, setMappedEvents } = useContext(AudioStateProviderContext)
  const [channelColorLight, setChannelColorLight] = useState('#fff')
  useEffect(() => {
    setChannelColorLight(`${lightenDarkenColor(channelColor, 80)}`)
  }, [setChannelColorLight, channelColor])

  useEffect(() => {
    if (canvasBoxRef.current) {
      canvasBoxElement = canvasBoxRef.current
    }
    if(canvasRef.current){
      canvasElement = canvasRef.current
    }
  }, [canvasBoxRef, canvasRef])

  const getX = (event: MouseEvent) => 
    event.clientX - canvasBoxElement.getBoundingClientRect().left

  const getY = (event: MouseEvent) =>  
    event.clientY - (canvasBoxElement.getBoundingClientRect().top)

    const setHoveredNote = useCallback((note: PlayEvent | null)=> {
      setHoveredNoteState(note)
      hoveredNote = note
    }, [ setHoveredNoteState])
    
  const findMappedEvents = useCallback(() => {
    const joinedEvents = flatMap(channels, (channel: TChannel) =>
      channel.notes.map((note) => ({ ...note, color: channel.color })))

    const mappedEvents = joinedEvents.map((event, i) => {
      const x = event.time * RECT_WIDTH * canvasTimeUnit +
        notesListWidth 
      const y = (canvasElement.height -
          ((event.midiNumber - MIDI_OFFSET ) * rectangleHeight +
            RECT_SPACE * (event.midiNumber - MIDI_OFFSET)) + RECT_SPACE)
          
      const width = Math.floor(
        event.duration * RECT_WIDTH * canvasTimeUnit
      )
      return {x, y, width, noteId: event.noteId }
    })
    setMappedEvents(mappedEvents)

  }, [ channels, canvasTimeUnit ])

  const findNoteByGridCoordinates = useCallback((event: React.MouseEvent) => {
    if (!canvasBoxElement || !coordinatesMapLocal) {
      return null
    }
    const x = event.clientX - canvasBoxElement.getBoundingClientRect().left
    const y =
      event.clientY - (canvasBoxElement.getBoundingClientRect().top)
    const rectangle = coordinatesMapLocal.find(
      (i) =>
        x >= i.x &&
        x <= i.x + RECT_WIDTH &&
        y >= i.y &&
        y <= i.y + rectangleHeight
    )
    if (!rectangle) {
      return null
    }
    if (rectangle.x >= canvasBoxElement.getBoundingClientRect().top) {
      canvasBoxElement.scroll(rectangle.x + 100, rectangle.y)
    }
    const timePoint =  ((rectangle.x - notesListWidth) / RECT_WIDTH )/ canvasTimeUnit
    const note = {
      noteId: rectangle.noteId,
      midiNumber: rectangle.midiNumber,
      time: timePoint,
      duration: 1 / canvasTimeUnit,
      coordX: rectangle.x,
      coordY: rectangle.y
    }
    return note
  }, [canvasTimeUnit])


  const canvasSetup = useCallback((timer?: number) => {
    if (!canvasElement || !canvasBoxElement) {
      return
    }
    canvasCtx = canvasElement?.getContext('2d')
    if (!canvasCtx) {
      return
    }

    const maxDuration = channels.reduce(
      (acc, curr) => (curr.duration > acc ? curr.duration : acc),
      0
    ) // find longest duration
    if (controllerState.RECORDING && timer) {
      compositionDuration = timer// for recording
    } else {
      compositionDuration = maxDuration // for playing
    }
    // wierd calculation of canvas width
    const xLength =
      compositionDuration * canvasTimeUnit + 5 <
        (width - canvasBoxElement.getBoundingClientRect().left) / (RECT_WIDTH + RECT_SPACE)
        ? (width - canvasBoxElement.getBoundingClientRect().left + notesListWidth)/ (RECT_WIDTH + RECT_SPACE)
        : compositionDuration * canvasTimeUnit + 5

    canvasElement.width = xLength * (RECT_WIDTH + RECT_SPACE) - notesListWidth
    canvasElement.height = canvasBoxElement.getBoundingClientRect().height - 25
    rectangleHeight =
      Math.ceil((canvasElement.height - RECT_SPACE * notes.length) / notes.length)
    fontSize.current = rectangleHeight * 0.6

    notesListWidth = fontSize.current + RECT_WIDTH + 5
    return {
      canvasBoxElement,
      canvasElement,
      canvasCtx,
      xLength,
    }

  }, [canvasElement, canvasBoxElement, channels, controllerState.RECORDING, canvasTimeUnit, notes.length, width])

  const renderEmptyCanvas = useCallback(() => {
   const settings = canvasSetup()
   if(!settings){
     return
   }
   const { xLength } = settings
   if(!settings?.xLength){
     return
   }
    coordinatesMapLocal = []
    // draw notes to canvas
    const calculateFontYPosition = (i: number) => {
      return ((rectangleHeight / 1.3)) + (i * ((rectangleHeight + RECT_SPACE)))
    }
    // eslint-disable-next-line array-callback-return
    notes.filter((note: Note, i: number): void => {
      if(!canvasCtx){
        return
      }
      for (let j = 0; j < xLength; j++) {
        const x = ((j - 1)* RECT_WIDTH ) + notesListWidth
        const y = ((rectangleHeight + RECT_SPACE) * i) 
        if (j === 0) {
          canvasCtx.fillStyle = '#fff' //fontColor
          canvasCtx.font = `${fontSize.current}px Comic Sans MS`
          canvasCtx.fillText(
            note.note,
            5,
            calculateFontYPosition(i)
          )
          canvasCtx.fillStyle = CANVAS_BACKGROUND
          canvasCtx.fillRect(0, y - RECT_SPACE, notesListWidth, RECT_SPACE) // horizontal border
          canvasCtx.fillRect(RECT_WIDTH + notesListWidth, i * (rectangleHeight + RECT_SPACE), RECT_SPACE, rectangleHeight + RECT_SPACE) // vertical border
        } else {
          canvasCtx.fillStyle = RECT_COLOR
          canvasCtx.fillRect(x, y, RECT_WIDTH, rectangleHeight)
          canvasCtx.fillStyle = CANVAS_BACKGROUND
          canvasCtx.fillRect(x - RECT_SPACE, y, RECT_SPACE, rectangleHeight) // fill vertical spaces
          canvasCtx.fillRect(x,  y - RECT_SPACE, RECT_WIDTH + RECT_SPACE, RECT_SPACE) // fill horizontal spaces
          coordinatesMapLocal = [...coordinatesMapLocal, { noteId: `${note.midiNumber}${x}${y}`, midiNumber: note.midiNumber, x, y }]
        }
      }
    })
  }, [notes, canvasSetup])

  // updates channel coordinates
  const updateChannels = useCallback(
    () => {
        const newChannels = channels.map(channel=> {
            const newNotes = channel.notes.map(note=> {
               note.coordX = note.time * RECT_WIDTH * canvasTimeUnit +
            notesListWidth
            note.coordY =
              canvasElement.height -
              ((note.midiNumber - MIDI_OFFSET ) * rectangleHeight +
                RECT_SPACE * (note.midiNumber - MIDI_OFFSET)) + RECT_SPACE
              return note
            })
            channel.notes = newNotes
            return channel
        })
        setChannels(newChannels)
    },
    [ setChannels, canvasTimeUnit],
)
  const renderNotes = useCallback(() => {
    const joinedEvents = flatMap(channels, (channel: TChannel) =>
    channel.notes.map((note) => ({ ...note, color: channel.color }))
    ) // join notes from all channels into a single array, + add a color field
    joinedEvents.forEach((event, i) => {
      if(!canvasCtx){
        return
      }
      const x = event.time * RECT_WIDTH * canvasTimeUnit +
        notesListWidth
      const y =
          canvasElement.height -
          ((event.midiNumber - MIDI_OFFSET ) * rectangleHeight +
            RECT_SPACE * (event.midiNumber - MIDI_OFFSET)) + RECT_SPACE
        
      const width = Math.floor(
        event.duration * RECT_WIDTH * canvasTimeUnit
      )

      canvasCtx.fillStyle = event.color ? event.color : channelColor
      canvasCtx.clearRect(x, y, width, rectangleHeight)
      canvasCtx.fillRect(x, y, width, rectangleHeight)
      if(event.noteId === hoveredNote?.noteId){
        canvasCtx.fillStyle = channelColorLight
        canvasCtx.fillRect(hoveredNote.coordX,hoveredNote.coordY,2, rectangleHeight)
        canvasCtx.fillRect(hoveredNote.coordX,hoveredNote.coordY, width, 2);
        canvasCtx.fillRect(hoveredNote.coordX,hoveredNote.coordY + rectangleHeight -2 , width, 2);
        canvasCtx.fillRect(hoveredNote.coordX + width - 2,hoveredNote.coordY , 2, rectangleHeight);
      }
    })

  }, [canvasTimeUnit, channelColor, channels, hoveredNoteState, width, channelColorLight])

  const renderTimerBar = useCallback(() => {
    if (!canvasCtx) {
      return
    }
    const x =
      Math.floor(timer * RECT_WIDTH * canvasTimeUnit) +
      notesListWidth
    renderEmptyCanvas()
    renderNotes()
    if(timer){
      canvasCtx.fillStyle = controllerState.PLAYING
      ? BAR_COLOR
      : RECORDING_BAR_COLOR
      canvasCtx.fillRect(x, 0, BAR_WIDTH, canvasElement.height)
      if (x >= canvasBoxElement.getBoundingClientRect().width - 200) {
        const y = 300
        canvasBoxElement.scroll(x + 100, y)
      }
    }
  }, [canvasTimeUnit, controllerState, timer, setTimer, renderEmptyCanvas, renderNotes, compositionDuration ])

  // stop play rendering
  const stopPlayRender = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    setTimer(0)
    setControllerState({'PLAYING': false})
  }, [setTimer, setControllerState])
  // play rendering
  const renderPlay = useCallback(() => {
    if (controllerState.PLAYING) return
    const frequency =  Number((1 / canvasTimeUnit).toFixed(3))
    for (let i = 0; i <= compositionDuration + 0.2; i += frequency ) {
      const t = setTimeout(() => {
        setTimer(i)
      }, i * 1000)
      timers.current = [...timers.current, t]
    }
    setTimeout(() => stopPlayRender(), compositionDuration * 1000 + 500)
  }, [
    canvasTimeUnit,
    controllerState.PLAYING,
    stopPlayRender,
    renderTimerBar,
    compositionDuration,
    noteDuration,
    setTimer
  ])
  useEffect(() => {
    findMappedEvents()
  }, [findMappedEvents, channels, width])
  useEffect(() => {
    setCanvasTimeUnit(1 / noteDuration)
  }, [noteDuration, setCanvasTimeUnit])
  useEffect(() => {
    renderEmptyCanvas()
  }, [renderEmptyCanvas, canvasSetup])
  useEffect(() => {
    renderNotes()
  }, [renderNotes])
  useEffect(() => {
    updateChannels()
  }, [updateChannels])

  useEffect(() => {
    renderTimerBar()
  }, [timer])
  return {
    canvasBoxRef,
    canvasRef,
    rectangleHeight,
    coordinatesMapRef,
    canvasTimeUnit,
    renderPlay,
    stopPlayRender,
    findMappedEvents,
    findNoteByGridCoordinates,
    getX,
    getY,
    setHoveredNote
  }
}

function useNotesGridRenderer(): INotesGridRenderer {
  return NotesGridRenderer()
}

export default NotesGridRenderer

export {
  useNotesGridRenderer
}