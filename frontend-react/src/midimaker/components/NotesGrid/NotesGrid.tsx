
import React, { useCallback, useContext, useState, useEffect } from 'react'
import Loader from '../shared/loader/Loader'
import { SoundfontProviderContext } from '../../providers/SoundfontProvider/SoundfontProvider'
import { useNotesGridController } from './components/NotesGridController'
import { useNotesGridRenderer } from './components/NotesGridRenderer'
import { CANVAS_BACKGROUND, CANVAS_HEIGHT, RECT_WIDTH } from './constants'
import { PlayEvent, SoundfontProviderContextValue } from '../../providers/SoundfontProvider/SoundFontProvider.types'
import styled from 'styled-components'
import { useAudioController } from '../../controllers/AudioController'
import useScreenSize from '../../../providers/screenSize.provider'
import { makeStyles } from '@material-ui/core'

export interface ICoordinates {
    noteId: string;
    midiNumber: number;
    x: number;
    y: number;
}

const useStyles = (height: number, renderingDone: boolean)=> makeStyles((theme)=> ({
    canvas: {
        cursor: 'pointer',
        background: 'rgba(4,32,55,0.7)',
        outline: 'none'
    },
    notesListCanvas: {
        background: 'rgba(4,32,55)',
        outline: 'none',
        padding: '1px 0', 
        zIndex: 1,
        position: 'fixed',
        borderTop: 'none',
    },
    canvasContainer: {
        visibility: renderingDone ? 'visible': 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        background: CANVAS_BACKGROUND, 
        flexGrow: 1,
    },
    gridCanvasContainer: {
        height: `${height - 195}px`, 
        background: CANVAS_BACKGROUND, 
        padding: '1px', 
        position: 'relative',
        width: 'fit-content',
    }
}))
const SNotesGrid = styled.div`
    cursor: pointer;
`

function NotesGrid(): JSX.Element {
    const soundfontCtx = useContext<SoundfontProviderContextValue>(
        SoundfontProviderContext
    )
    const { canvasRef, canvasBoxRef, canvasTimeUnit, setHoveredNote, notesListRef, renderingDone } = useNotesGridRenderer()
    const { updateNote } = useAudioController()
    const { loading } = soundfontCtx
    const { toggleNote, findNoteInChannel } = useNotesGridController()
    const { height, width } = useScreenSize()
    const [ resizing, setResizing] = useState(false)
    const [updatedNote, setUpdatedNote] = useState<PlayEvent | null>(null)
    const [currentNote, setCurrentNote] = useState<PlayEvent | null>(null)
    
    const classes = useStyles(height, renderingDone)()
    const onResize = useCallback((event)=> {
        event.persist()
        if(!currentNote || !event.shiftKey){
            return
        }
        const x = event.clientX - (canvasBoxRef?.current?.getBoundingClientRect()?.left  || 0)
        const duration =(x - currentNote?.coordX) / RECT_WIDTH / canvasTimeUnit
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
            <div className={classes.canvasContainer}>
                <div className={classes.notesListCanvas}>
                    <canvas id="notesList-canvas"ref={notesListRef} />
                </div>
            <SNotesGrid ref={canvasBoxRef} className={classes.gridCanvasContainer} >
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    className={classes.canvas}
                    onMouseOver={()=> canvasRef.current?.focus() }
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
                    </div>
        ,
        [canvasBoxRef, canvasRef, toggleNote, width]
    )
    return (
        <div style={{ overflow: 'auto', width: 'inherit', display:'flex'}}>
            {loading?
                <Loader />
                : createCanvas()}
        </div>
    )
}

export default NotesGrid