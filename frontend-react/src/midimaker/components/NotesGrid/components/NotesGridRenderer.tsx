import React, {
  createRef,
  useCallback,
  useRef,
  useState,
  useEffect,
  RefObject,
  useContext,
  MouseEvent,
  createContext
} from 'react'

import { flatMap, range } from 'lodash'

import {
  RECT_WIDTH, RECT_SPACE, BAR_COLOR,
  BAR_WIDTH, RECT_COLOR, CANVAS_BACKGROUND
} from '../constants'
import { Note, PlayEvent, TChannel } from '../../../providers/SoundfontProvider/SoundFontProvider.types'
import { AudioStateProviderContext } from '../../../providers/AudioStateProvider/AudioStateProvider'
import { lightenDarkenColor, generateMarks } from './utils'
import { makeStyles, Slider } from '@material-ui/core'
import { useAudioController } from '../../../controllers/AudioController'
import { NotesGridControllerCtx } from './NotesGridController'
import { SoundfontProviderContext } from '../../../providers/SoundfontProvider/SoundfontProvider'
import useScreenSize from '../../../../providers/screenSize.provider'
import Loader from '../../shared/loader/Loader'

export interface ICoordinates {
  noteId: string;
  midiNumber: number;
  x: number;
  y: number;
}

export const CanvasContext = createContext<any>(null)
export type TMappedEvent = {
  instrumentName: string,
  noteId: string,
  y: number,
  x: number,
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
  notesListRef: RefObject<HTMLCanvasElement>,
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
  renderingDone: boolean
}

export interface INotesGridRendererProps {
  classes: Record<string, string>,
}

const useStyles = (height: number, width: number, playing: boolean, paused: boolean) => makeStyles((theme) => ({
  canvas: {
    cursor: 'pointer',
    background: RECT_COLOR,
    outline: 'none',
  },
  timerCanvas: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: !playing && !paused ? -1 : 2,
    background: 'transparent',
  },
  notesCanvas: {
    outline: 'none',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'transparent',
    cursor: 'pointer',
  },
  notesListCanvas: {
    background: 'rgba(4,32,55)',
    outline: 'none',
    padding: '1px 0',
    zIndex: 1,
    borderTop: 'none',
    fontFamily: 'Fira Code'
  },
  canvasContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    background: RECT_COLOR,
    flexGrow: 1,
    width: '200px'
  },
  gridCanvasContainer: {
    height: `${height - 220}px`,
    background: CANVAS_BACKGROUND,
    padding: '1px',
    position: 'relative',
  },
  timerSlider: {
    color: theme.palette.primary.light,
    height: '4px',
    marginTop: '-2px',
    padding: `${theme.spacing(0)}px  0`,
    // marginLeft: `${-RECT_SPACE}px`,
    '& .MuiSlider-markLabel': {
      top: '2px',
      color: theme.palette.primary.light
    },
    // '&.MuiSlider-marked':{
    //   marginBottom: '11px'
    // }
  },
  canvasAndTimerContainer: {
    width: 'fit-content',

  }
}))


let coordinatesMapLocal: ICoordinates[]
let notesListWidth = 0
let canvasCtx: CanvasRenderingContext2D | null = null
let notesListCtx: CanvasRenderingContext2D | null = null
let canvasTimerCtx: CanvasRenderingContext2D | null = null
let notesCanvasCtx: CanvasRenderingContext2D | null = null
let hoveredNote: PlayEvent | null = null

function NotesGridRenderer() {
  const { height, width } = useScreenSize()

  const [renderingDone, setRenderingDone] = useState(false)
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
  const [canvasBoxElement, setCanvasBoxElement] = useState<HTMLDivElement | null>(null)
  const [notesListElement, setNotesListElement] = useState<HTMLCanvasElement | null>(null)
  const [canvasTimerElement, setCanvasTimerElement] = useState<HTMLCanvasElement | null>(null)
  const [notesCanvasElement, setNotesCanvasElement] = useState<HTMLCanvasElement | null>(null)
  const [resizing, setResizing] = useState(false)
  const [currentNote, setCurrentNote] = useState<PlayEvent | null>(null)
  const notesListRef = createRef<HTMLCanvasElement>()
  const canvasBoxRef = createRef<HTMLDivElement>()
  const canvasRef = createRef<HTMLCanvasElement>()
  const canvasTimerRef = createRef<HTMLCanvasElement>()
  const notesCanvasRef = createRef<HTMLCanvasElement>()
  const canvasWrapperRef = createRef<HTMLDivElement>()
  const lastTimerPosition = useRef(0)

  const fontSize = useRef<number>(0)
  const [hoveredNoteState, setHoveredNoteState] = useState<PlayEvent | null>(hoveredNote)
  // const timers = useRef<Array<number>>([])
  const { channels, setChannels, noteDuration, channelColor, notes, controllerState,
    currentChannel, compositionDuration } = useContext(AudioStateProviderContext)
  const { loading } = useContext(SoundfontProviderContext)
  const { toggleNote, findNoteInChannel, timer, setTimer, setNotesCoordinates, initCtx } = useContext(NotesGridControllerCtx)
  const { updateNote } = useAudioController()
  const [channelColorLight, setChannelColorLight] = useState('#fff')
  const classes = useStyles(height, width, controllerState.PLAYING || false, controllerState.PAUSED || false)()
  useEffect(() => {
    setChannelColorLight(`${lightenDarkenColor(currentChannel?.color || '', 90)}`)
  }, [setChannelColorLight, currentChannel])

  useEffect(() => {
    if (canvasBoxRef.current) {
      setCanvasBoxElement(canvasBoxRef.current)
    }
    if (canvasRef.current) {
      setCanvasElement(canvasRef.current)
    }
    if (notesListRef.current) {
      setNotesListElement(notesListRef.current)
    }
    if (canvasTimerRef.current) {
      setCanvasTimerElement(canvasTimerRef.current)
    }
    if (notesCanvasRef.current) {
      setNotesCanvasElement(notesCanvasRef.current)
    }
  }, [canvasBoxRef, canvasRef, notesListRef, canvasTimerRef, notesCanvasRef])

  useEffect(() => {
    if (canvasBoxElement && canvasElement && notesListElement && canvasTimerElement) {
      initCtx(canvasElement, canvasBoxElement, notesListElement, canvasTimerElement)
    }
  }, [canvasBoxElement, canvasElement, notesListElement, initCtx, canvasTimerElement])
  const renderTimerBar = useCallback(() => {
    if (!canvasBoxElement || !canvasTimerCtx || !canvasElement) {
      return
    }
    // canvasTimerCtx.clearRect(0, 0, canvasTimerElement?.width || 0, canvasTimerElement?.height || 0)
    const x =(timer / noteDuration) * (RECT_WIDTH + RECT_SPACE)
    if (controllerState.PLAYING) {
      canvasWrapperRef?.current?.scroll(x - (canvasBoxElement.getBoundingClientRect().width / 2), 0)
    }
    if (timer) {
      canvasTimerCtx.fillStyle = BAR_COLOR
      canvasTimerCtx.clearRect(lastTimerPosition.current, 0, BAR_WIDTH + 1, canvasTimerElement?.height || 0)
      canvasTimerCtx.fillRect(x, 0, BAR_WIDTH, canvasTimerElement?.height || 0)
      lastTimerPosition.current = x
    }
    if (!timer) {
      canvasTimerCtx.clearRect(0, 0, canvasTimerElement?.width || 0, canvasTimerElement?.height || 0)
      lastTimerPosition.current = 0
    }
  }, [canvasBoxElement, canvasElement, canvasTimerElement, canvasWrapperRef,
    controllerState.PLAYING, lastTimerPosition, noteDuration, timer])


  const setHoveredNote = useCallback((note: PlayEvent | null) => {
    setHoveredNoteState(note)
    hoveredNote = note
  }, [setHoveredNoteState])

  const canvasSetup = useCallback(() => {
    if (!canvasElement || !canvasBoxElement || !notesListElement || !canvasTimerElement || !notesCanvasElement) {
      return
    }
    canvasCtx = canvasElement?.getContext('2d')
    canvasTimerCtx = canvasTimerElement?.getContext('2d')
    notesListCtx = notesListElement?.getContext('2d')
    notesCanvasCtx = notesCanvasElement?.getContext('2d')
    if (!canvasCtx || !canvasTimerCtx) {
      return
    }
    const xLength = Math.ceil(compositionDuration / noteDuration)
    canvasElement.width = xLength * (RECT_WIDTH + RECT_SPACE)
    canvasElement.height = canvasBoxElement.getBoundingClientRect().height
    canvasTimerElement.width = xLength * (RECT_WIDTH + RECT_SPACE)
    canvasTimerElement.height = canvasBoxElement.getBoundingClientRect().height
    notesCanvasElement.width = xLength * (RECT_WIDTH + RECT_SPACE)
    notesCanvasElement.height = canvasBoxElement.getBoundingClientRect().height
    notesListElement.height = canvasBoxElement.getBoundingClientRect().height
    notesListWidth = Math.ceil(fontSize.current + 45)
    notesListElement.width = notesListWidth
    return xLength

  }, [canvasBoxElement, canvasElement, canvasTimerElement, compositionDuration, noteDuration, notesCanvasElement, notesListElement])

  const renderEmptyCanvas = useCallback(() => {
    if (!canvasElement || !canvasBoxElement || !notesListElement || renderingDone) {
      return
    }
    const xLength = canvasSetup()
    if (!xLength) {
      return
    }
    const rectangleHeight = (canvasElement.height - RECT_SPACE * notes.length) / notes.length
    coordinatesMapLocal = []
    // draw notes to canvas
    const calculateFontYPosition = (i: number) => {
      return (rectangleHeight / 1.5) + (i * (rectangleHeight + RECT_SPACE))
    }
    // eslint-disable-next-line array-callback-return
    notes.filter((note: Note, i: number): void => {
      if (!canvasCtx || !notesListCtx) {
        return undefined
      }
      canvasElement.toBlob((blob)=> 
      console.log(blob))
      for (let j = 0; j < xLength + 1; j++) {
        const x = Math.floor((j - 1) * (RECT_WIDTH + RECT_SPACE))
        const y = Math.floor((rectangleHeight + RECT_SPACE) * i)
        if (j === 0) {
          const fontSize = rectangleHeight * 0.6
          notesListCtx.fillRect(x, y, RECT_WIDTH, RECT_SPACE)
          notesListCtx.fillStyle = '#fff' //fontColor
          notesListCtx.font = `${fontSize}px 'Fira Code'`
          notesListCtx.fillText(
            note.note,
            5,
            calculateFontYPosition(i)
          )
          notesListCtx.fillStyle = '#4973ac'
          notesListCtx.fillRect(0, y - RECT_SPACE, notesListWidth, RECT_SPACE) // horizontal border
          notesListCtx.fillRect(RECT_WIDTH + notesListWidth, i * (rectangleHeight + RECT_SPACE), RECT_SPACE, rectangleHeight + RECT_SPACE) // vertical border
        } else {
          canvasCtx.fillStyle = CANVAS_BACKGROUND
          canvasCtx.fillRect(x, y, RECT_SPACE, rectangleHeight) // fill vertical spaces
          canvasCtx.fillRect(x, y - RECT_SPACE, RECT_WIDTH + RECT_SPACE, RECT_SPACE) // fill horizontal spaces
          coordinatesMapLocal = [...coordinatesMapLocal, { noteId: `${note.midiNumber}`, midiNumber: note.midiNumber, x, y }]
        }
        if (i === notes.length - 1) {
          canvasCtx.fillRect(0, y + rectangleHeight, (RECT_WIDTH + RECT_SPACE) * xLength, RECT_SPACE)
          notesListCtx.fillRect(0, y + rectangleHeight, notesListWidth, RECT_SPACE)
        }
        if (j === xLength) {
          canvasCtx.fillRect(x + RECT_WIDTH, y, RECT_SPACE, rectangleHeight)
        }
      }
    })
    setRenderingDone(true)
    // requestAnimationFrame(renderEmptyCanvas)
    setNotesCoordinates(coordinatesMapLocal)
  }, [canvasElement, canvasBoxElement, notesListElement, renderingDone, canvasSetup, notes, setNotesCoordinates])
  // updates channel coordinates when duration or note range has changed
  const updateChannels = useCallback(
    () => {
      if (!canvasElement) {
        return
      }
      const rectangleHeight = (canvasElement.height - RECT_SPACE * notes.length) / notes.length
      const newChannels = channels.map(channel => {
        const newNotes = channel.notes.map(note => {
          note.coordX = note.time * (RECT_WIDTH + RECT_SPACE) / noteDuration
          const noteIdx = notes.findIndex(noteA => Number(noteA.midiNumber) === note.midiNumber)
          note.coordY = (rectangleHeight + RECT_SPACE) * noteIdx
          return note
        })
        channel.notes = newNotes
        return channel
      })
      setChannels(newChannels)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setChannels, noteDuration, notes, canvasElement],
  )
  const renderNotes = useCallback(() => {
    if (!notesCanvasElement) {
      return
    }
    const rectangleHeight = (notesCanvasElement.height - RECT_SPACE * notes.length) / notes.length
    notesCanvasCtx?.clearRect(0, 0, notesCanvasElement.width, notesCanvasElement.height)
    const joinedEvents = flatMap(channels, (channel: TChannel) =>
      channel.notes.map((note: PlayEvent) => ({ ...note, color: channel.color }))
    ) 
    // join notes from all channels into a single array, + add a color field
    joinedEvents.forEach((event, i) => {
      if (!notesCanvasCtx) {
        return
      }
      const width = Math.floor(
        event.duration * (RECT_WIDTH) * 1 / noteDuration
      )
      notesCanvasCtx.fillStyle = event.color ? event.color : channelColor
      notesCanvasCtx.fillRect(event.coordX + + RECT_SPACE * 2, event.coordY + RECT_SPACE, width, rectangleHeight)
      if (event.noteId === hoveredNote?.noteId) {
        notesCanvasCtx.strokeStyle = channelColorLight
        notesCanvasCtx.strokeRect(hoveredNote.coordX + RECT_SPACE * 2, hoveredNote.coordY + RECT_SPACE, width, rectangleHeight)
      }

    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteDuration, canvasElement, channelColor, channels, channelColorLight, hoveredNoteState, notes, renderEmptyCanvas])
  // stop play rendering
  const onResize = useCallback((event) => {
    event.persist()
    if (!currentNote || !event.shiftKey) {
      return
    }
    const x = event.clientX - (canvasBoxRef?.current?.getBoundingClientRect()?.left || 0)
    const duration = (x - currentNote?.coordX) / RECT_WIDTH * noteDuration
    const newNote = { ...currentNote, duration }
    updateNote(newNote)
  }, [currentNote, canvasBoxRef, noteDuration, updateNote])

  const getBlobFromCanvas = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject)=> {
        console.log(canvasElement)
        return canvasElement?.toBlob((blob) => {
            console.log(blob)
            if(blob){
                return resolve(blob)
            }
            else{
                return reject(blob)
            }
        })
    })
}, [ canvasElement ])
  const handleOnClick = useCallback((event) => {
    event.persist()
    const note = !event.shiftKey && toggleNote(event)
    if (note) {
      setCurrentNote(note)
    }
  }, [toggleNote])

  const handleMouseDown = useCallback((event) => {
    const note = findNoteInChannel(event)
    note && setCurrentNote(note)
    note && setResizing(true)

  }, [setCurrentNote, setResizing, findNoteInChannel])

  const handleMouseUp = useCallback(() => {
    setResizing(false)
  }, [setResizing])

  const handleKeyDown = useCallback((event) => {
    event.persist()
    if (!event.shiftKey || !currentNote) {
      return
    }
    setHoveredNote(currentNote)
  }, [setHoveredNote, currentNote])

  const onMouseMove = useCallback((event) => {
    const note = findNoteInChannel(event)
    if (note) {
      setCurrentNote(note)
    }
    return resizing ? onResize(event) : null
  }, [resizing, onResize, setCurrentNote, findNoteInChannel])
  const onSliderMove = useCallback((event, value) => {
    const compositionDuration = channels.reduce(
      (acc, curr) => (curr.duration > acc ? curr.duration : acc),
      0)
    if(value > compositionDuration){
      return 
    }
    setTimer(value)
  }, [channels, setTimer])

  useEffect(() => {
    setRenderingDone(false)
  }, [setRenderingDone, noteDuration, notes, compositionDuration])
  useEffect(() => {
    renderEmptyCanvas()
  }, [renderEmptyCanvas])
  useEffect(() => {
    renderNotes()
  }, [renderNotes])
  useEffect(() => {
    updateChannels()
  }, [updateChannels])
  useEffect(() => {
    renderTimerBar()
  }, [renderTimerBar, timer])
  useEffect(() => {
    if (notesCanvasElement) {
      notesCanvasElement.tabIndex = 1000
      notesCanvasElement.addEventListener('onKeydown',
        handleKeyDown)
      return () => {
        notesCanvasElement?.removeEventListener('onKeydown',
          handleKeyDown)
      }
    }
  }, [canvasRef, canvasBoxRef, notesListRef, handleKeyDown, notesCanvasElement])
  return (
    <div className={classes.canvasContainer} >
      {(loading || !renderingDone) && <Loader />}
      <div className={classes.notesListCanvas}>
        <canvas id="notesList-canvas" ref={notesListRef} />
      </div>
      <div ref={canvasWrapperRef} style={{ overflow: 'auto', overflowY: 'hidden' }} >
        <div ref={canvasBoxRef} className={classes.gridCanvasContainer} >
          <div className={classes.canvasAndTimerContainer}>
            <canvas
              className={classes.canvas}
              id="canvas"
              ref={canvasRef}
            />
            <Slider
              id="timer-slider"
              value={timer}
              onChange={onSliderMove}
              step={noteDuration > 0.075 ? 1 : 0.5}
              className={classes.timerSlider}
              marks={generateMarks(compositionDuration, noteDuration, noteDuration > 0.075 ? 1 : 0.5)}
              aria-labelledby="timer-slider"
              max={compositionDuration}
              min={0}
            />
          </div>
          <canvas
            ref={canvasTimerRef}
            className={classes.timerCanvas}
          >

          </canvas>
          <canvas
            onMouseOver={() => notesCanvasRef.current?.focus()}
            onClick={handleOnClick}
            onMouseDown={handleMouseDown}
            onMouseMove={onMouseMove}
            onTouchMove={onMouseMove}
            onTouchStart={handleMouseDown}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
            onKeyUp={() => setHoveredNote(null)}
            ref={notesCanvasRef}
            className={classes.notesCanvas}
          />

        </div>
      </div>
      <div >
      </div>
    </div>
  )
}

export default NotesGridRenderer
