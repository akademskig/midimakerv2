
import React, { useCallback, useContext, useState, useEffect } from 'react'
import Loader from '../shared/loader/Loader'
import { SoundfontProviderContext } from '../../providers/SoundfontProvider/SoundfontProvider'
import { useNotesGridController } from './components/NotesGridController'
import { useNotesGridRenderer } from './components/NotesGridRenderer'
import { CANVAS_BACKGROUND, CANVAS_HEIGHT, RECT_WIDTH } from './constants'
import { PlayEvent, SoundfontProviderContextValue } from '../../providers/SoundfontProvider/SoundFontProvider.types'
import styled from 'styled-components'
import { useAudioController } from '../../controllers/AudioController'

export interface ICoordinates {
    noteId: string;
    midiNumber: number;
    x: number;
    y: number;
}

const canvasStyle = {
    background: 'rgba(4,32,55,0.7)',
    outline: 'none'
}

const SNotesGrid = styled.div`
    cursor: pointer;
`

function NotesGrid(): JSX.Element {
    const soundfontCtx = useContext<SoundfontProviderContextValue>(
        SoundfontProviderContext
    )
    const { canvasRef, canvasBoxRef, canvasTimeUnit, setHoveredNote } = useNotesGridRenderer()
    const { updateNote } = useAudioController()
    const { loading } = soundfontCtx
    const { toggleNote, findNoteInChannel } = useNotesGridController()
    const [ resizing, setResizing] = useState(false)
    const [updatedNote, setUpdatedNote] = useState<PlayEvent | null>(null)
    const [currentNote, setCurrentNote] = useState<PlayEvent | null>(null)

    const onResize = useCallback((event)=> {
        event.persist()
        if(!currentNote || !event.shiftKey){
            return
        }
        const x = event.clientX - (canvasBoxRef?.current?.getBoundingClientRect()?.left  || 0)
        const duration =( x - currentNote?.coordX) / RECT_WIDTH / canvasTimeUnit
        const newNote = { ...currentNote, duration }
        updateNote(newNote)
    }, [updateNote, canvasBoxRef, toggleNote, setUpdatedNote, currentNote, setHoveredNote ])

    const handleOnClick = useCallback((event) => {
        event.persist()
        const note = !event.shiftKey && toggleNote(event)
        if(note){
            setCurrentNote(note)
        }
      
    }, [ toggleNote])

    const handleMouseDown = useCallback((event)=> {
        const note = findNoteInChannel(event)
        note && setCurrentNote(note)
        note && setResizing(true)
        
    }, [ currentNote, setCurrentNote, setResizing, findNoteInChannel ])

    const handleMouseUp = useCallback(()=> {
        setResizing(false)
    }, [ updateNote, updatedNote, setResizing ])

    const handleKeyDown = useCallback((event) => {
        event.persist()
        if(!event.shiftKey || !currentNote){
            return
        }
        setHoveredNote(currentNote)
    }, [ setHoveredNote, findNoteInChannel, currentNote ])

    const onMouseMove = useCallback((event) => {
        const note = findNoteInChannel(event)
        if(note){
            return setCurrentNote(note)
        }
        return resizing? onResize(event): null
    }, [resizing, onResize, handleKeyDown, setCurrentNote, findNoteInChannel])

    useEffect(() => {
        if(canvasRef.current){
            canvasRef.current.tabIndex = 1000
            canvasRef.current?.addEventListener('onKeydown',
            handleKeyDown)
            return () => {
                canvasRef.current?.removeEventListener('onKeydown',
            handleKeyDown)
        } 
            
        }
    }, [canvasRef])
  
    const createCanvas = useCallback(
        () =>
            <SNotesGrid ref={canvasBoxRef} style={{ height: CANVAS_HEIGHT, background: CANVAS_BACKGROUND, position: 'relative'  }}>
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    style={canvasStyle}
                    onClick={handleOnClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={onMouseMove}
                    onTouchMove={onMouseMove}
                    onTouchStart={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onKeyDown={handleKeyDown}
                    onKeyUp={()=> setHoveredNote(null)}
                />
            </SNotesGrid>
        ,
        [canvasBoxRef, canvasRef, toggleNote]
    )
    return (
        <div>
            {loading ?
                <Loader />
                : createCanvas()}
        </div>
    )
}

export default NotesGrid