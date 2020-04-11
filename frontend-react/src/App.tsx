import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import MainRoutes from './routes';
import { ThemeProvider, useTheme } from '@material-ui/core';
import { NotificationContainer } from 'react-notifications';

function App() {
const theme = useTheme()

  return (
    <div className="App">
    <ThemeProvider theme={theme}>

      <Router>
        <MainRoutes/>
      </Router>
      <NotificationContainer />

      </ThemeProvider>
    </div>
  );
}

export default App;
