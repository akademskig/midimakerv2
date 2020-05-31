import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import AppRoutes from './routes';
import { MuiThemeProvider } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
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
