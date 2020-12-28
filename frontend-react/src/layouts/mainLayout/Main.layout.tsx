
import React, { Fragment } from 'react';
import styled, { css } from 'styled-components'
import NavigationDrawer from './navigation/NavigationDrawer';
import { MainRoutes } from '../../routes';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    width: '100%',
    marginTop: '64px',
    justifyContent: 'flexStart',
    [theme.breakpoints.down('xs')]: {
      marginTop: '54px'
    }
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