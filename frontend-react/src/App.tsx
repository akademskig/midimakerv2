import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import AppRoutes from './routes';
import { MuiThemeProvider } from '@material-ui/core';
import { NotificationContainer } from 'react-notifications';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import { useSelector } from 'react-redux';
import { getError } from './redux/global/global.selectors';
import useNotify from './utils/notifications';
import { selectNotification } from './redux/global/global.selectors';
import { Notification } from './redux/global/global.types';
import Notifications from './components/common/Notifications';

function App() {


  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <AppRoutes />
          </Router>
        </MuiThemeProvider>
      </ThemeProvider>
      <Notifications/ >
    </div>
  );
}

export default App;
