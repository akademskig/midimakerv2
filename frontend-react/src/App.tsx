import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import AppRoutes from './routes';
import { useTheme, MuiThemeProvider } from '@material-ui/core';
import { NotificationContainer } from 'react-notifications';
import { ThemeProvider } from 'styled-components';

function App() {
  const theme = useTheme()
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <AppRoutes />
          </Router>
          <NotificationContainer />
        </MuiThemeProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
