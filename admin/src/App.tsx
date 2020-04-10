// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList, UserEdit, UserCreate, UserShow } from './resources/user.resource';
import UserIcon from '@material-ui/icons/Group';
import DashboardPage from './pages/Dashboard.page';
import authProvider from './providers/auth.provider';
import AuthPage from './pages/Auth.page';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import dataProvider from './providers/api.provider';

import './App.scss'
import MainLayout from './layouts/Main.layout';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7fbeda',
      dark: '#146179',
      main: '#4d8ea8' 
    },
    secondary: {
      main: '#ea5168',
      light: '#ff8496',
      dark: '#b2143e'
    },
  },
});
const App = () =>
  <ThemeProvider theme={theme}>
    <Admin layout={MainLayout} theme={theme} loginPage={AuthPage} dashboard={DashboardPage} dataProvider={dataProvider} authProvider={authProvider} >
      <Resource name="users" show={UserShow}list={UserList} icon={UserIcon} edit={UserEdit} create={UserCreate} />
    </Admin>
  </ThemeProvider>
export default App;