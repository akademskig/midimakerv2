import React, {
  createRef,
  useCallback,
  useRef,
  useState,
  useEffect,
  RefObject,
  useContext,
  MouseEvent,
  createContext,
  memo
} from "react"

import { flatMap, uniqueId } from "lodash"

import {
  RECT_WIDTH,
  RECT_SPACE,
  BAR_COLOR,
  BAR_WIDTH,
  CANVAS_BACKGROUND,
} from "./constants"
import {
  Note,
  PlayEvent,
  TChannel,
} from "../../providers/SoundfontProvider/SoundFontProvider.types"
import { AudioStateProviderContext } from "../../providers/AudioStateProvider/AudioStateProvider"
import { lightenDarkenColor, generateMarks } from "./utils"
import { useAudioController } from "../../controllers/AudioController"
import { NotesGridControllerCtx } from "./NotesGridController"
import { SoundfontProviderContext } from "../../providers/SoundfontProvider/SoundfontProvider"
import Loader from "../shared/loader/Loader"
import useScreenSize from "../../../../hooks/useScreenSize"
import {
  SCanvas,
  SCanvasAndTimerContainer,
  SCanvasContainer,
  SGridCanvasContainer,
  SNotesCanvas,
  SNotesListCanvas,
  STimerCanvas,
  STimerSlider,
} from "./NotesGridRenderer.styles"

export interface ICoordinates {
  noteId: string
  midiNumber: number
  x: number
  y: number
}

export const CanvasContext = createContext<any>(null)
export type TMappedEvent = {
  channelId: string
  noteId: string
  y: number
  x: number
  width: number
}
interface IController {
  recording: boolean
  playing: boolean
  resetRecording: boolean
}
interface IControllerInput {
  recording?: boolean
  playing?: boolean
  resetRecording?: boolean
}
export interface INotesGridRendererProps {
  controller: IController
  setController: (ctrl: IControllerInput) => void
  recording: {
    currentTime: number
  }
  absTime: number
}
export interface INotesGridRenderer {
  canvasBoxRef: RefObject<HTMLDivElement>
  canvasRef: RefObject<HTMLCanvasElement>
  notesListRef: RefObject<HTMLCanvasElement>
  rectangleHeight: number
  coordinatesMapRef: RefObject<ICoordinates[]>
  canvasTimeUnit: number
  renderPlay: () => void
  stopPlayRender: () => void
  findNoteByGridCoordinates: (event: React.MouseEvent) => PlayEvent | null
  findMappedEvents: () => void
  getX: (event: MouseEvent) => number
  getY: (event: MouseEvent) => number
  setHoveredNote: (event: PlayEvent | null) => void
  renderingDone: boolean
}

export interface INotesGridRendererProps {
  classes: Record<string, string>
}

let coordinatesMapLocal: ICoordinates[]
let notesListWidth = 0
let canvasCtx: CanvasRenderingContext2D | null = null
let notesListCtx: CanvasRenderingContext2D | null = null
let canvasTimerCtx: CanvasRenderingContext2D | null = null
let notesCanvasCtx: CanvasRenderingContext2D | null = null
let hoveredNote: PlayEvent | null = null

function NotesGridRenderer() {
  const { height } = useScreenSize()

  const [renderingDone, setRenderingDone] = useState(false)
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(
    null
  )
  const [canvasBoxElement, setCanvasBoxElement] =
    useState<HTMLDivElement | null>(null)
  const [notesListElement, setNotesListElement] =
    useState<HTMLCanvasElement | null>(null)
  const [canvasTimerElement, setCanvasTimerElement] =
    useState<HTMLCanvasElement | null>(null)
  const [notesCanvasElement, setNotesCanvasElement] =
    useState<HTMLCanvasElement | null>(null)
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
  const [hoveredNoteState, setHoveredNoteState] = useState<PlayEvent | null>(
    hoveredNote
  )
  // const timers = useRef<Array<number>>([])
  const {
    channels,
    noteDuration,
    channelColor,
    notes,
    controllerState,
    currentChannel,
    compositionDuration,
    audioStateLoading,
  } = useContext(AudioStateProviderContext)
  const { loading } = useContext(SoundfontProviderContext)
  const {
    toggleNote,
    findNoteInChannel,
    timer,
    setTimer,
    setNotesCoordinates,
    initCtx,
  } = useContext(NotesGridControllerCtx)
  const { updateNote } = useAudioController()
  const [channelColorLight, setChannelColorLight] = useState("#fff")

  useEffect(() => {
    setChannelColorLight(
      `${lightenDarkenColor(currentChannel?.color || "", 90)}`
    )
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
    if (
      canvasBoxElement &&
      canvasElement &&
      notesListElement &&
      canvasTimerElement
    ) {
      initCtx(
        canvasElement,
        canvasBoxElement,
        notesListElement,
        canvasTimerElement
      )
    }
  }, [
    canvasBoxElement,
    canvasElement,
    notesListElement,
    initCtx,
    canvasTimerElement,
  ])
  const renderTimerBar = useCallback(() => {
    if (!canvasBoxElement || !canvasTimerCtx || !canvasElement) {
      return
    }
    // canvasTimerCtx.clearRect(0, 0, canvasTimerElement?.width || 0, canvasTimerElement?.height || 0)
    const x = (timer / noteDuration) * (RECT_WIDTH + RECT_SPACE)
    if (controllerState.PLAYING) {
      canvasWrapperRef?.current?.scroll(
        x - canvasBoxElement.getBoundingClientRect().width / 2,
        0
      )
    }
    if (timer) {
      canvasTimerCtx.fillStyle = BAR_COLOR
      canvasTimerCtx.clearRect(
        lastTimerPosition.current,
        0,
        BAR_WIDTH + 1,
        canvasTimerElement?.height || 0
      )
      canvasTimerCtx.fillRect(x, 0, BAR_WIDTH, canvasTimerElement?.height || 0)
      lastTimerPosition.current = x
    }
    if (!timer) {
      canvasTimerCtx.clearRect(
        0,
        0,
        canvasTimerElement?.width || 0,
        canvasTimerElement?.height || 0
      )
      lastTimerPosition.current = 0
    }
  }, [
    canvasBoxElement,
    canvasElement,
    canvasTimerElement,
    canvasWrapperRef,
    controllerState.PLAYING,
    lastTimerPosition,
    noteDuration,
    timer,
  ])

  const setHoveredNote = useCallback(
    (note: PlayEvent | null) => {
      setHoveredNoteState(note)
      hoveredNote = note
    },
    [setHoveredNoteState]
  )

  const canvasSetup = useCallback(() => {
    if (
      !canvasElement ||
      !canvasBoxElement ||
      !notesListElement ||
      !canvasTimerElement ||
      !notesCanvasElement
    ) {
      return
    }
    canvasCtx = canvasElement?.getContext("2d")
    canvasTimerCtx = canvasTimerElement?.getContext("2d")
    notesListCtx = notesListElement?.getContext("2d")
    notesCanvasCtx = notesCanvasElement?.getContext("2d")
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
  }, [
    canvasBoxElement,
    canvasElement,
    canvasTimerElement,
    compositionDuration,
    noteDuration,
    notesCanvasElement,
    notesListElement,
  ])

  const renderEmptyCanvas = useCallback(() => {
    if (
      !canvasElement ||
      !canvasBoxElement ||
      !notesListElement ||
      renderingDone
    ) {
      return
    }
    const xLength = canvasSetup()
    if (!xLength) {
      return
    }
    const rectangleHeight =
      (canvasElement.height - RECT_SPACE * notes.length) / notes.length
    coordinatesMapLocal = []
    // draw notes to canvas
    const calculateFontYPosition = (i: number) => {
      return rectangleHeight / 1.5 + i * (rectangleHeight + RECT_SPACE)
    }
    // eslint-disable-next-line array-callback-return
    notes.filter((note: Note, i: number): void => {
      if (!canvasCtx || !notesListCtx) {
        return undefined
      }

      for (let j = 0; j < xLength + 1; j++) {
        const x = Math.floor((j - 1) * (RECT_WIDTH + RECT_SPACE))
        const y = Math.floor((rectangleHeight + RECT_SPACE) * i)
        if (j === 0) {
          const fontSize = rectangleHeight * 0.6
          notesListCtx.fillRect(x, y, RECT_WIDTH, RECT_SPACE)
          notesListCtx.fillStyle = "#fff" //fontColor
          notesListCtx.font = `${fontSize}px 'Fira Code'`
          notesListCtx.fillText(note.note, 5, calculateFontYPosition(i))
          notesListCtx.fillStyle = "#4973ac"
          notesListCtx.fillRect(0, y - RECT_SPACE, notesListWidth, RECT_SPACE) // horizontal border
          notesListCtx.fillRect(
            RECT_WIDTH + notesListWidth,
            i * (rectangleHeight + RECT_SPACE),
            RECT_SPACE,
            rectangleHeight + RECT_SPACE
          ) // vertical border
        } else {
          canvasCtx.fillStyle = CANVAS_BACKGROUND
          canvasCtx.fillRect(x, y, RECT_SPACE, rectangleHeight) // fill vertical spaces
          canvasCtx.fillRect(
            x,
            y - RECT_SPACE,
            RECT_WIDTH + RECT_SPACE,
            RECT_SPACE
          ) // fill horizontal spaces
          coordinatesMapLocal = [
            ...coordinatesMapLocal,
            { noteId: uniqueId(), midiNumber: note.midiNumber, x, y },
          ]
        }
        if (i === notes.length - 1) {
          canvasCtx.fillRect(
            0,
            y + rectangleHeight,
            (RECT_WIDTH + RECT_SPACE) * xLength,
            RECT_SPACE
          )
          notesListCtx.fillRect(
            0,
            y + rectangleHeight,
            notesListWidth,
            RECT_SPACE
          )
        }
        if (j === xLength) {
          canvasCtx.fillRect(x + RECT_WIDTH, y, RECT_SPACE, rectangleHeight)
        }
      }
    })
    setRenderingDone(true)
    // requestAnimationFrame(renderEmptyCanvas)
    setNotesCoordinates(coordinatesMapLocal)
  }, [
    canvasElement,
    canvasBoxElement,
    notesListElement,
    renderingDone,
    canvasSetup,
    notes,
    setNotesCoordinates,
  ])

  const renderNotes = useCallback(() => {
    if (!notesCanvasElement) {
      return
    }
    const rectangleHeight =
      (notesCanvasElement.height - RECT_SPACE * notes.length) / notes.length
    notesCanvasCtx?.clearRect(
      0,
      0,
      notesCanvasElement.width,
      notesCanvasElement.height
    )
    const joinedEvents = flatMap(channels, (channel: TChannel) =>
      channel.notes.map((note: PlayEvent) => ({
        ...note,
        color: channel.color,
      }))
    )
    // join notes from all channels into a single array, + add a color field
    joinedEvents.forEach((event, i) => {
      if (!notesCanvasCtx) {
        return
      }
      const width = Math.floor((event.duration * RECT_WIDTH * 1) / noteDuration)
      notesCanvasCtx.fillStyle = event.color ? event.color : channelColor
      notesCanvasCtx.fillRect(
        event.coordX + +RECT_SPACE * 2,
        event.coordY + RECT_SPACE,
        width,
        rectangleHeight
      )
      if (event.noteId === hoveredNote?.noteId) {
        notesCanvasCtx.strokeStyle = channelColorLight
        notesCanvasCtx.strokeRect(
          hoveredNote.coordX + RECT_SPACE * 2,
          hoveredNote.coordY + RECT_SPACE,
          width,
          rectangleHeight
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    noteDuration,
    canvasElement,
    channelColor,
    channels,
    channelColorLight,
    hoveredNoteState,
    notes,
    renderEmptyCanvas,
  ])
  // stop play rendering
  const onResize = useCallback(
    (event) => {
      event.persist()
      if (!currentNote || !event.shiftKey) {
        return
      }
      const x =
        event.clientX -
        (canvasBoxRef?.current?.getBoundingClientRect()?.left || 0)
      const duration = ((x - currentNote?.coordX) / RECT_WIDTH) * noteDuration
      const newNote = { ...currentNote, duration }
      updateNote(newNote)
    },
    [currentNote, canvasBoxRef, noteDuration, updateNote]
  )

  const handleOnClick = useCallback(
    (event) => {
      event.persist()
      const note = !event.shiftKey && toggleNote(event)
      if (note) {
        setCurrentNote(note)
      }
    },
    [toggleNote]
  )

  const handleMouseDown = useCallback(
    (event) => {
      const note = findNoteInChannel(event)
      note && setCurrentNote(note)
      note && setResizing(true)
    },
    [setCurrentNote, setResizing, findNoteInChannel]
  )

  const handleMouseUp = useCallback(() => {
    setResizing(false)
  }, [setResizing])

  const handleKeyDown = useCallback(
    (event) => {
      event.persist()
      if (!event.shiftKey || !currentNote) {
        return
      }

      setHoveredNote(currentNote)
    },
    [setHoveredNote, currentNote]
  )

  const onMouseMove = useCallback(
    (event) => {
      const note = findNoteInChannel(event)
      if (note) {
        setCurrentNote(note)
      }
      return resizing ? onResize(event) : null
    },
    [resizing, onResize, setCurrentNote, findNoteInChannel]
  )
  const onSliderMove = useCallback(
    (event, value) => {
      const compositionDuration = channels.reduce(
        (acc, curr) => (curr.duration > acc ? curr.duration : acc),
        0
      )
      if (value > compositionDuration) {
        return
      }
      setTimer(value)
    },
    [channels, setTimer]
  )

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
    renderTimerBar()
  }, [renderTimerBar, timer])

  useEffect(() => {
    if (notesCanvasElement) {
      notesCanvasElement.tabIndex = 1000
      notesCanvasElement.addEventListener("onKeydown", handleKeyDown)
      return () => {
        notesCanvasElement?.removeEventListener("onKeydown", handleKeyDown)
      }
    }
  }, [canvasRef, canvasBoxRef, notesListRef, handleKeyDown, notesCanvasElement])
  return (
    <SCanvasContainer>
      {(loading || !renderingDone || audioStateLoading) && <Loader />}
      <SNotesListCanvas>
        <canvas id="notesList-canvas" ref={notesListRef} />
      </SNotesListCanvas>
      <div
        ref={canvasWrapperRef}
        style={{ overflow: "auto", overflowY: "hidden" }}
      >
        <SGridCanvasContainer ref={canvasBoxRef} height={height}>
          <SCanvasAndTimerContainer>
            <SCanvas id="canvas" ref={canvasRef} />
            <STimerSlider
              id="timer-slider"
              value={timer}
              onChange={onSliderMove}
              step={noteDuration > 0.075 ? 1 : 0.5}
              marks={generateMarks(
                compositionDuration,
                noteDuration,
                noteDuration > 0.075 ? 1 : 0.5
              )}
              aria-labelledby="timer-slider"
              max={compositionDuration}
              min={0}
            />
          </SCanvasAndTimerContainer>
          <STimerCanvas
            ref={canvasTimerRef}
            $playing={controllerState.PLAYING}
            $paused={controllerState.PAUSED}
          />
          <SNotesCanvas
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
          />
        </SGridCanvasContainer>
      </div>
    </SCanvasContainer>
  )
}

export default memo(NotesGridRenderer)
