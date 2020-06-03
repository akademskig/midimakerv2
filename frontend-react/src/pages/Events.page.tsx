
import React, { Fragment, useState } from 'react';
import { Paper, Fab } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import EventsList from '../components/events/events.list';
import AddIcon from '@material-ui/icons/Add'
import ModalC from '../components/common/ModalC';
import LoginForm from '../components/forms/Login.form';
import AddEventForm from '../components/forms/AddEvent.form';
import AddEventC from '../components/events/AddEventC';

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

const EventsPage = () => {
  const classes = useStyles()
  return (
    <Fragment>
      <Paper className={classes.paper}>
        <EventsList />
      </Paper>
      <AddEventC />
    </Fragment>
  );
};

export default EventsPage


