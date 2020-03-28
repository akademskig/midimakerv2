// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from './lists/user.list';
import { PostEdit, PostCreate, PostList } from './resources/post.resource';
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import DashboardPage from './pages/Dashboard.page';
import authProvider from './providers/auth.provider';

const dataProvider = jsonServerProvider('http://localhost:4000');
const App = () => 
<Admin dashboard={DashboardPage}dataProvider={dataProvider} authProvider={authProvider}>
  <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/>
  <Resource name="users" list={UserList} icon={UserIcon} />

</Admin>;

export default App;