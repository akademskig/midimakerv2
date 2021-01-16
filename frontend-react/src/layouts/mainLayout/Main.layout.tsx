
import React, { Fragment } from 'react';
import NavigationDrawer from './navigation/NavigationDrawer';
import { MainRoutes } from '../../routes';

const MainLayout = ({ children }: { children: any }) => {
  return (
    <Fragment>
      <NavigationDrawer>
         <MainRoutes></MainRoutes>
      </NavigationDrawer>
    </Fragment>
  )
}

export default MainLayout