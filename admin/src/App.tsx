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
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import './App.scss'

const dataProvider = jsonServerProvider('http://localhost:4000');

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  },
});
console.log(theme)
const App = () =>
    <Admin theme={theme}loginPage={AuthPage} dashboard={DashboardPage} dataProvider={dataProvider}  authProvider={authProvider} >
      <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
      <Resource name="users" list={UserList} icon={UserIcon} />
    </Admin>

export default App;