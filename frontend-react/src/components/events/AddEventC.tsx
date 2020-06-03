import React, { Fragment, useState } from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ModalC from '../common/ModalC';
import AddEventForm from '../forms/AddEvent.form';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      height: '100vh',
      justifyContent: 'center',
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing() * 3,
      border: `solid 1px ${theme.palette.grey[300]}`,
      borderRadius: theme.shape.borderRadius
    },
    fab: {
      position: 'absolute',
      bottom: '10px',
      right: '10px'
    }
  }));

export default function AddEventC() {
    const classes = useStyles()

    const [addEventOpen, setAddEventOpen] = useState(false)

    return (
        <Fragment>
            <Fab className={classes.fab} color="secondary" aria-label="add" onClick={() => setAddEventOpen(true)}>
                <AddIcon />
            </Fab>
            <ModalC open={addEventOpen} setOpen={setAddEventOpen} disableBackdropClick={true}>
                <AddEventForm modalClose={setAddEventOpen} ></AddEventForm>
            </ModalC>
        </Fragment>

    )
}