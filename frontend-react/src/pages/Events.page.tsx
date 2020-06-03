
import React, { Fragment } from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import EventsList from '../components/events/events.list';
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


