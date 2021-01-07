import React from 'react'
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import PulseLoader from "react-spinners/PulseLoader";
import RingLoader from "react-spinners/RingLoader";
import { CANVAS_BACKGROUND, RECT_COLOR } from '../../NotesGrid/constants';

const useStyles = makeStyles((theme: Theme) =>  ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'inherit',
        flexGrow: 1,
        backgroundColor: RECT_COLOR
    }
}))
function Loader() {

    const classes = useStyles()
    const theme = useTheme()

    return (
        <div className={classes.root}>
            <RingLoader size={100} color={CANVAS_BACKGROUND}/>
        </div>
    )
}

export default Loader