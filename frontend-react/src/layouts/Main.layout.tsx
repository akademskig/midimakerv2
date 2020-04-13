
import React, { Fragment } from 'react';
import Header from '../components/common/Header';
import styled, { css } from 'styled-components'

const LayoutContainer = styled.div`
 ${({ theme }) => `
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  padding: 1em;
  ${theme.breakpoints.down('sm')} {
    ${css({ 'min-height': "calc(100vh - 56px)" })}
    padding: 0.5em;
  }
  `}
`
const MainLayout = ({ children }: { children: any }) => {
  return (
    <Fragment>
      <Header></Header>
      <LayoutContainer>
        {children}

      </LayoutContainer>
    </Fragment>
  )
}

export default MainLayout