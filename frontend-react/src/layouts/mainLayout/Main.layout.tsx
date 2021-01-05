
import React, { Fragment } from 'react';
import NavigationDrawer from './navigation/NavigationDrawer';
import { MainRoutes } from '../../routes';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    marginTop: '54px',
    justifyContent: 'flexStart',
    marginLeft: '0',
    transition: theme.transitions.create('marginLeft', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('xs')]: {
      marginLeft: '57px',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: '64px',
      marginLeft: '61px'
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '64px',
      marginLeft:'220px',
    },
   
  },
}));
const MainLayout = ({ children }: { children: any }) => {
  const classes = useStyles()
  return (
    <Fragment>
      <NavigationDrawer>
        <div className={classes.container}>
         <MainRoutes></MainRoutes>
        </div>
      </NavigationDrawer>
    </Fragment>
  )
}

export default MainLayout