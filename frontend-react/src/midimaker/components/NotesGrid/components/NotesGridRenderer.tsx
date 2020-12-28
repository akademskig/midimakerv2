import {
  createRef,
  useCallback,
  useRef,
  useState,
  useEffect,
  RefObject,
  useContext,
} from 'react'

import { flatMap } from 'lodash'

import {
  RECT_WIDTH, RECT_SPACE, RECT_TIME, RECORDING_BAR_COLOR, BAR_COLOR,
  BAR_WIDTH, REC_TIME, RECT_COLOR, CANVAS_BACKGROUND, MIDI_OFFSET
} from '../constants'
import { ICoordinates } from '../NotesGrid.types'
import { ChannelRenderEvent, Note, PlayEvent, TChannel } from '../../../providers/SoundfontProvider/SoundFontProvider.types'
import { AudioStateProviderContext } from '../../../providers/AudioStateProvider/AudioStateProvider'


let rectangleHeight = 30


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
  findNoteByGridCoordinates: (event: React.MouseEvent) => PlayEvent | null
}

let canvasBoxElement: HTMLDivElement
let canvasElement: HTMLCanvasElement
let coordinatesMapLocal: ICoordinates[]
let notesListWidth = 0
let compositionDuration = 0
function NotesGridRenderer(): INotesGridRenderer {

  const [recordingTimesRemained, setRecordingTimesRemained] =
    useState<Array<number>>([])
  const [canvasTimeUnit, setCanvasTimeUnit] = useState(RECT_TIME)
  const [lastRectangle, setLastRectangle] = useState(0)

  const canvasRef = createRef<HTMLCanvasElement>()
  const canvasBoxRef = createRef<HTMLDivElement>()
  const fontSize = useRef<number>(0)
  const timers = useRef<Array<number>>([])
  const recordingTimers = useRef<Array<number>>([])
  const coordinatesMapRef = useRef<Array<ICoordinates>>([])

  const { channels, noteDuration, channelColor, notes, gridNotes, controllerState, setControllerState } = useContext(AudioStateProviderContext)

  useEffect(() => {
    if (canvasBoxRef.current) {
      canvasBoxElement = canvasBoxRef.current
    }
    if(canvasRef.current){
      canvasElement = canvasRef.current
    }
  }, [canvasBoxRef, canvasRef])

  // useEffect(() => {
  //   setElements()
  // }, [canvasBoxRef, canvasRef, setElements])

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
      midiNumber: rectangle.midiNumber,
      time: timePoint,
      duration: 1 / canvasTimeUnit,
    }
    return note
  }, [canvasTimeUnit])


  const canvasSetup = useCallback((timer?: number) => {
    if (!canvasElement || !canvasBoxElement) {
      return
    }
    const canvasCtx = canvasElement?.getContext('2d')
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
        window.innerWidth  / (RECT_WIDTH + RECT_SPACE)
        ? (window.innerWidth + notesListWidth)/ (RECT_WIDTH + RECT_SPACE)
        : compositionDuration * canvasTimeUnit + 5

    canvasElement.width = xLength * (RECT_WIDTH + RECT_SPACE) - notesListWidth
    canvasElement.height = canvasBoxElement.getBoundingClientRect().height - 25
    rectangleHeight =
      Math.ceil((canvasElement.height - RECT_SPACE * notes.length) / notes.length)
    fontSize.current = rectangleHeight * 0.6

    notesListWidth = fontSize.current + RECT_WIDTH + 5
    console.log(notesListWidth)
    return {
      canvasBoxElement,
      canvasElement,
      canvasCtx,
      xLength,
    }

  }, [canvasElement, canvasBoxElement, channels, controllerState.RECORDING, canvasTimeUnit, notes.length])

  const renderEmptyCanvas = useCallback((canvasCtx, xLength) => {
    coordinatesMapLocal = []
    // draw notes to canvas
    const calculateFontYPosition = (i: number) => {
      return ((rectangleHeight / 1.3)) + (i * ((rectangleHeight + RECT_SPACE)))
      // return rectangleHeight / fontSize + 2 +
      // fontSize +
      // i * (rectangleHeight + rectangleHeight / (fontSize * 2.5))
    }
    // eslint-disable-next-line array-callback-return
    notes.filter((note: Note, i: number): void => {
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
          coordinatesMapLocal = [...coordinatesMapLocal, { midiNumber: note.midiNumber, x, y }]
        }
      }
    })
  }, [notes])

  const renderTimerBar = useCallback((timer: number, canvasCtx: CanvasRenderingContext2D) => {
    const x =
      RECT_WIDTH +
      Math.floor(timer * RECT_WIDTH * canvasTimeUnit) +
      notesListWidth
    canvasCtx.fillStyle = controllerState.RECORDING
      ? RECORDING_BAR_COLOR
      : BAR_COLOR
    canvasCtx.fillStyle = controllerState.PLAYING
      ? BAR_COLOR
      : RECORDING_BAR_COLOR
    canvasCtx.clearRect(x, 0, BAR_WIDTH, canvasElement.height)
    canvasCtx.fillRect(x, 0, BAR_WIDTH, canvasElement.height)
    setLastRectangle(x)
    if (x >= canvasBoxElement.getBoundingClientRect().width - 200) {
      const y = 300
      canvasBoxElement.scroll(x + 100, y)
    }
  }, [canvasTimeUnit, controllerState.PLAYING, controllerState.RECORDING])

  // const x = RECT_WIDTH + Math.floor(n.time * RECT_WIDTH * this.state.rectTime) + this.offsetFirst
  // const y = Math.floor(canvas.height - ((n.midiNumber - this.props.midiOffset) * RECT_HEIGHT + RECT_SPACE * (n.midiNumber - this.props.midiOffset))) - (RECT_HEIGHT + RECT_SPACE)
  // const width = Math.floor(n.duration * RECT_WIDTH * this.state.rectTime)
  // c.fillStyle = n.color ? n.color : this.state.channelColor
  // c.clearRect(x, y, width, RECT_HEIGHT);
  // c.fillRect(x, y, width, RECT_HEIGHT);

  const renderNotes = useCallback((joinedEvents: ChannelRenderEvent[],
    canvasElement: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D) => {
    joinedEvents.forEach((event, i) => {
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
    })

  }, [canvasTimeUnit, channelColor])

  const drawInitial = useCallback(
    (timer?: number) => {
      const settings = canvasSetup(timer)
      if (!settings) {
        return
      }
      const { canvasCtx,  canvasElement, xLength } = settings

      const joinedEvents = flatMap(channels, (channel: TChannel) =>
        channel.notes.map((note) => ({ ...note, color: channel.color }))
      ) // join notes from all channels into a single array, + add a color field

      renderEmptyCanvas(canvasCtx, xLength)
      if (joinedEvents.length > 0) {
        renderNotes(joinedEvents, canvasElement, canvasCtx)
      }
      if (timer) {
        renderTimerBar(timer, canvasCtx)
      }
      if (lastRectangle && !timer) {
        canvasCtx.fillStyle = controllerState.RECORDING
          ? RECORDING_BAR_COLOR
          : BAR_COLOR
        canvasCtx.fillStyle = controllerState.PLAYING
          ? BAR_COLOR
          : RECORDING_BAR_COLOR
        canvasCtx.fillRect(lastRectangle, 0, BAR_WIDTH, canvasElement.height)
      }
    },
    [canvasSetup, channels, renderEmptyCanvas, lastRectangle, renderNotes,
      renderTimerBar, controllerState.RECORDING, controllerState.PLAYING]
  )


  // stop play rendering
  const stopPlayRender = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    setLastRectangle(0)
  }, [])
  // play rendering
  const renderPlay = useCallback(() => {
    if (controllerState.PLAYING) return
    console.log(compositionDuration, 'compositionDuration')
    for (let i = 0; i < compositionDuration; i += 0.05 / canvasTimeUnit) {
      const t = window.setTimeout(() => {
        const count = i
        drawInitial(count)
      }, Math.ceil(i * 1000))
      timers.current = [...timers.current, t]
    }
    window.setTimeout(() => stopPlayRender(), compositionDuration * 1000)
  }, [
    canvasTimeUnit,
    controllerState.PLAYING,
    drawInitial,
    stopPlayRender,
  ])
  //
  const showRecordingBar = useCallback(() => {
    const timesRemained = []
    for (let i = 0; i < REC_TIME; i += 0.05 / canvasTimeUnit) {
      timesRemained.push(i)
      const t = window.setTimeout(() => {
        drawInitial(i)
      }, Math.floor(i * 1000))
      recordingTimers.current = [...recordingTimers.current, t]
    }
    setRecordingTimesRemained(timesRemained)
  }, [canvasTimeUnit, drawInitial, setRecordingTimesRemained])

  const stopRecordingBar = useCallback(
    (pause) => {
      const { currentTime } = gridNotes
      recordingTimers.current.forEach((t) => clearTimeout(t))
      if (!pause) setLastRectangle(0)
      drawInitial(currentTime)
    },
    [drawInitial, gridNotes]
  )

  const resetRec = useCallback(() => {
    setRecordingTimesRemained([])
  }, [setRecordingTimesRemained])

  const resumeRec = useCallback(() => {
    let start = null
    const { currentTime } = gridNotes
    for (let i = 0; i < recordingTimesRemained.length; i++) {
      if (recordingTimesRemained[i] < currentTime) continue
      if (!start) start = recordingTimesRemained[i]
      const t = window.setTimeout(() => {
        drawInitial(recordingTimesRemained[i])
      }, Math.floor((recordingTimesRemained[i] - start) * 1000))
      recordingTimers.current.push(t)
    }
  }, [drawInitial, gridNotes, recordingTimesRemained])

  useEffect(() => {
    const { PLAYING, RECORDING, RECORDING_RESET } = controllerState
    if (PLAYING) {
      renderPlay()
    } else if (!PLAYING) {
      stopPlayRender()
    } else if (RECORDING && RECORDING_RESET) {
      showRecordingBar()
      setControllerState({
        ...controllerState,
        RECORDING_RESET: false
      })
    } else if (RECORDING && !RECORDING_RESET) {
      resumeRec()
    } else if (!RECORDING) {
      stopRecordingBar(true)
    } else if (!RECORDING_RESET) {
      stopRecordingBar(false)
      resetRec()
    }
  }, [controllerState, renderPlay, resumeRec, showRecordingBar, stopPlayRender, stopRecordingBar, resetRec, setControllerState])

  useEffect(() => {
    setCanvasTimeUnit(1 / noteDuration)
  }, [noteDuration])
  useEffect(() => {
    drawInitial()
  }, [drawInitial])

  return {
    canvasBoxRef,
    canvasRef,
    rectangleHeight,
    coordinatesMapRef,
    canvasTimeUnit,
    renderPlay,
    findNoteByGridCoordinates
  }
}

function useNotesGridRenderer(): INotesGridRenderer {
  return NotesGridRenderer()
}

export default NotesGridRenderer

export {
  useNotesGridRenderer
}