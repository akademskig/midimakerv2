import React from 'react';

import {
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import AuthPage from './pages/Auth.page';
import { useSelector } from 'react-redux';
import { isAuthenticated } from './redux/auth/auth.selectors';
import MainPage from './pages/Main.page';
import UserProfile from './pages/UserProfile.page';
import MainLayout from './layouts/mainLayout/Main.layout';
import { GuardProvider, GuardedRoute } from "react-router-guards"
import { GuardFunctionRouteProps } from 'react-router-guards/dist/types';

let isAuth = false
function checkAuth(to: GuardFunctionRouteProps | null, from: GuardFunctionRouteProps | null, next: any) {
  if (isAuth) {
    next();
  }
  next.redirect('/auth');
};

const AppRoutes = () => {
  isAuth = useSelector(isAuthenticated)
  return (
    <Switch>
      <Route path="/auth" exact component={AuthPage} />
      <Route path="/" component={MainLayout} />
    </Switch>

  )
}

export const MainRoutes = () => {
  return (
    <GuardProvider guards={[checkAuth]}>
      <Switch>
        <GuardedRoute path="/dashboard" component={MainPage} />
        <GuardedRoute path="/user/profile" component={UserProfile} />
        <GuardedRoute path="/events/list" component={UserProfile} />
        <GuardedRoute path="/" component={() => <Redirect to="/dashboard"></Redirect>} />
      </Switch>
    </GuardProvider>
  )
}

export default AppRoutes