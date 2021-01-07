
import React, { Fragment } from 'react';
import NavigationDrawer from './navigation/NavigationDrawer';
import { MainRoutes } from '../../routes';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flexStart',
    overflow: 'hidden',
    marginLeft: '0',
    transition: theme.transitions.create('marginLeft', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));
const MainLayout = ({ children }: { children: any }) => {
  const classes = useStyles()
  return (
    <Fragment>
      <NavigationDrawer>
         <MainRoutes></MainRoutes>
      </NavigationDrawer>
    </Fragment>
  )
}

export default MainLayout