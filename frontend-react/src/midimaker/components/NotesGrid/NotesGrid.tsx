
import React, { useCallback, useContext, useState } from 'react'
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
}

const SNotesGrid = styled.div`
    cursor: pointer;
`

function NotesGrid(): JSX.Element {
    const soundfontCtx = useContext<SoundfontProviderContextValue>(
        SoundfontProviderContext
    )
    const { canvasRef, canvasBoxRef, canvasTimeUnit } = useNotesGridRenderer()
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
    }, [updateNote, canvasBoxRef, toggleNote, setUpdatedNote, currentNote ])

    const handleOnClick = useCallback((event) => {
        event.persist()
        !event.shiftKey && toggleNote(event)
      
    }, [ toggleNote])

    const handleMouseDown = useCallback((event)=> {
        const note = findNoteInChannel(event)
        note && setCurrentNote(note)
        note && setResizing(true)
        
    }, [ currentNote, setCurrentNote, setResizing, findNoteInChannel ])

    const handleMouseUp = useCallback(()=> {
        setResizing(false)
    }, [ updateNote, updatedNote, setResizing ])
    const createCanvas = useCallback(
        () =>
            <SNotesGrid ref={canvasBoxRef} style={{ height: CANVAS_HEIGHT, background: CANVAS_BACKGROUND, position: 'relative'  }}>
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    style={canvasStyle}
                    onClick={handleOnClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={resizing? onResize: ()=> {}}
                    onMouseUp={handleMouseUp}
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