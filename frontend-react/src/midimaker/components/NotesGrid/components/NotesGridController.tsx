import { MouseEvent, useCallback, useContext } from 'react'
import useAudioPlayer from '../../../controllers/AudioPlayer'
import { useNotesGridRenderer } from './NotesGridRenderer'
import { PlayEvent, TChannel } from '../../../providers/SoundfontProvider/SoundFontProvider.types'
import { TRecordingGrid, TSetRecordingGrid } from '../../../providers/AudioStateProvider/AudioStateProvider.types'
import { useAudioController } from '../../../controllers/AudioController'
import { AudioStateProviderContext } from '../../../providers/AudioStateProvider/AudioStateProvider'

export interface INotesGridControllerProps {
  canvasTimeUnit: number,
  currentChannel: TChannel | null,
  setRecordingGrid: TSetRecordingGrid
  offsetFirst: number,
  recordingGrid: TRecordingGrid
}

export interface INotesGridController {
  toggleNote: (event: MouseEvent<HTMLDivElement | HTMLCanvasElement, globalThis.MouseEvent>) => void
  findNoteInChannel: (event: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => PlayEvent | undefined
}

function NotesGridController(): INotesGridController {
  const { playNote } = useAudioPlayer()
  const { findNoteByGridCoordinates, getX, getY, rectangleHeight } = useNotesGridRenderer()
  const { handleToggleNote } = useAudioController()
  const { currentChannel, mappedEvents } = useContext(AudioStateProviderContext)

  const findNoteInChannel = useCallback((event: MouseEvent)=> {
    const currentNote = mappedEvents.find(mappedEvent => (getX(event) < mappedEvent.x + mappedEvent.width && getX(event) >= mappedEvent.x) &&
     (getY(event) >= mappedEvent.y && getY(event)<= mappedEvent.y + rectangleHeight))

    return currentChannel?.notes.find(note=> note.noteId === currentNote?.noteId)
  }, [mappedEvents, currentChannel, getX, getY, rectangleHeight])
  
  const toggleNote = useCallback(
    (event) => {
      event.stopPropagation()
      const note = findNoteByGridCoordinates(event)
      if(!note){
        return
      }
      playNote(note)
      return handleToggleNote(note)
    },
    [findNoteByGridCoordinates, playNote, handleToggleNote]
  )
  return {
    toggleNote,
    findNoteInChannel,
  }
}

export default NotesGridController

export function useNotesGridController(): INotesGridController {
  return NotesGridController()
}