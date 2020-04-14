import React from 'react';

import {
  Route,
  Switch
} from "react-router-dom";
import AuthPage from './pages/Auth.page';
import { useSelector } from 'react-redux';
import { isAuthenticated } from './redux/auth/auth.selectors';
import MainPage from './pages/Main.page';
import UserProfile from './pages/UserProfile.page';
import MainLayout from './layouts/Main.layout';
import { GuardProvider, GuardedRoute } from "react-router-guards"
import { GuardFunctionRouteProps } from 'react-router-guards/dist/types';

let isAuth = false
function checkAuth(to: GuardFunctionRouteProps | null, from: GuardFunctionRouteProps | null, next: any) {
  if (isAuth) {
    next();
  }
  next.redirect('/auth');
};



export const MainRoutes = () => {
  return (
    <Switch>
      <GuardProvider guards={[checkAuth]}>
        <GuardedRoute path="/app/dashboard" component={MainPage} />
        <GuardedRoute path="/app/user/profile" component={UserProfile} />
        <GuardedRoute path="/app/events/list" component={UserProfile} />
      </GuardProvider>
    </Switch>
  )
}


const AppRoutes = () => {
  isAuth = useSelector(isAuthenticated)

  return (
    <GuardProvider guards={[checkAuth]}>

    <Switch>
      <Route path="/auth" exact component={AuthPage} />
      <Route path="/app" component={MainLayout} />
    </Switch>
    </GuardProvider>

  )
}

export default AppRoutes