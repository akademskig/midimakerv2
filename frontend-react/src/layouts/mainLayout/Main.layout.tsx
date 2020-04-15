
import React, { Fragment } from 'react';
import styled, { css } from 'styled-components'
import NavigationDrawer from './navigation/NavigationDrawer';
import { MainRoutes } from '../../routes';

const LayoutContainer = styled.div`
 ${({ theme }) => `
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 100%;
  justify-content: flex-start;
  padding: 1em;
  ${theme.breakpoints.down('xs')} {
    ${css({ 'min-height': "calc(100vh - 56px)" })}
    padding: 0.5em;
  }
  `}
`
const MainLayout = ({ children }: { children: any }) => {
  return (
    <Fragment>
      <NavigationDrawer>
        <LayoutContainer>
         <MainRoutes></MainRoutes>
        </LayoutContainer>
      </NavigationDrawer>
    </Fragment>
  )
}

export default MainLayout