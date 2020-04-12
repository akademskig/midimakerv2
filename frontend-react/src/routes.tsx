import React from 'react';

import {
  Route,
  Redirect,
} from "react-router-dom";
import AuthPage from './pages/Auth.page';
import { useSelector } from 'react-redux';
import { isAuthenticated } from './redux/auth/auth.selectors';
import MainPage from './pages/Main.page';

const MainRoutes = () => {
  return (
    <div>
      <PrivateRoute path="/" component={MainPage} />
      <Route path='/auth' component={AuthPage} />
    </div>
  )
}

const PrivateRoute = ({ component: Component, path }: { component: any, path: string }, ...props: any) => {
  const isAuth = useSelector(isAuthenticated)
  return (
    <Route {...path}{...props} component={(props: any) => (
      isAuth === true
        ? <Component {...props} />
        : <Redirect to='/auth' />
    )} />
  )
}

export default MainRoutes