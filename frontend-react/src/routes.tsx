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
import MainLayout from './layouts/mainLayout/Main.layout';
import { GuardProvider, GuardedRoute } from "react-router-guards"
import SettingsPage from './pages/SettingsPage';
import EventsPage from './pages/Events.page';

// function checkAuth(to: GuardFunctionRouteProps | null, from: GuardFunctionRouteProps | null, next: any) {
//   const isAuth = useSelector(isAuthenticated)
//   if (isAuth) {
//     next();
//   }
//   next.redirect('/auth');
// };

const AppRoutes = (props: any) => {
  const isAuth = useSelector(isAuthenticated)
  return (
    <Switch>
      <Route path="/auth" exact component={AuthPage} />
      <Route path="/" component={() => isAuth ? <MainLayout {...props}/>: <Redirect to='/auth'/>} />
    </Switch>

  )
}

export const MainRoutes = () => {
  const isAuth = useSelector(isAuthenticated)
  return (
    <GuardProvider guards={[(to, from, next )=> isAuth ? next(): next.redirect("/auth")]}>
      <Switch>
        <GuardedRoute path="/dashboard" component={MainPage} />
        <GuardedRoute path="/events" component={EventsPage} />
        <GuardedRoute path="/settings" component={SettingsPage} />
        <GuardedRoute path="/" component={() => <Redirect to="/dashboard"></Redirect>} />
      </Switch>
    </GuardProvider>
  )
}

export default AppRoutes