
import React from 'react';
import { Container, Paper } from '@material-ui/core';
import MainLayout from '../layouts/Main.layout';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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

const MainPage = () => {

  const classes = useStyles()

  return (
      <MainLayout>
      <Container maxWidth="xs" className={classes.container}>
        <Paper className={classes.paper}>
       I'm dashboard
        </Paper>
      </Container>
      </MainLayout>
  );
};

export default MainPage


