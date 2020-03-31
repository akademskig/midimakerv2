// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from './resources/user.resource';
import { PostEdit, PostCreate, PostList } from './resources/post.resource';
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import DashboardPage from './pages/Dashboard.page';
import authProvider from './providers/auth.provider';
import AuthPage from './pages/Auth.page';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './App.scss'

const dataProvider = jsonServerProvider('http://localhost:4000');
// primary: {
//   light: '#7fbeda',
//   dark: '#146179',
//   main: '#4d8ea8' 
// },
// secondary: {
//   main: '#ea5168',
//   light: '#ff8496',
//   dark: '#b2143e'
// },
const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: deepOrange
  },
});
const App = () =>
  <ThemeProvider theme={theme}>
    <Admin theme={theme} loginPage={AuthPage} dashboard={DashboardPage} dataProvider={dataProvider} authProvider={authProvider} >
      <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
      <Resource name="users" list={UserList} icon={UserIcon} />
    </Admin>
  </ThemeProvider>
export default App;