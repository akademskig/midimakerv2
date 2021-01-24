import { makeStyles } from '@material-ui/core';
import React from 'react'
import robotImage from '../../assets/images/icons8-box.svg'


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      width: '100%', 
      justifyContent: 'center',
      height: 'inherit',
      '& img': {
        width: '230px'
      }
    },
  }));
const EmptyListDisplay = () => {

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <img src={robotImage} alt={'emptyList'} ></img>
        </div>
    )
}

export default EmptyListDisplay