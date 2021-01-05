import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import AppRoutes from './routes';
import { MuiThemeProvider } from '@material-ui/core';
import theme from './theme';
import AuthProvider from './providers/auth.provider';
import DataProvider from './providers/data.provider';
import NotificationsProvider from './components/common/notifications/Notifications.provider';

function App() {


  return (
    <div className="App">
        <MuiThemeProvider theme={theme}>
          <NotificationsProvider>
          <AuthProvider>
            <DataProvider>
            <Router>
              <AppRoutes />
            </Router>
            </DataProvider>
          </AuthProvider>
        </NotificationsProvider> 
        </MuiThemeProvider>
    </div>
  );
}

export default App;
