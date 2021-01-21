import React, { useContext, memo } from 'react';

import {
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import AuthPage from './pages/Auth.page';
import MainPage from './pages/Main.page';
import MainLayout from './layouts/mainLayout/Main.layout';
import { GuardProvider, GuardedRoute } from "react-router-guards"
import SettingsPage from './pages/SettingsPage';
import { AuthCtx } from './providers/auth.provider';
import NewMidi from './midimaker/pages/NewMidi';
import MidiCollections from './midimaker/pages/MidiCollections';

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/auth" exact component={AuthPage} />
      <Route path="/" component={MainLayout} />
    </Switch>

  )
}

export const MainRoutes = () => {
  const {isAuth} = useContext(AuthCtx)
  return (
    <GuardProvider guards={[(to, from, next )=> isAuth ? next(): next.redirect("/auth")]}>
      <Switch>
        <GuardedRoute path="/dashboard" component={MainPage} />
        <GuardedRoute path="/midimaker" component={NewMidi}/>
        <GuardedRoute path="/settings" component={SettingsPage} />
        <GuardedRoute path="/collections" component={MidiCollections} />
        <GuardedRoute exact path="/" component={() => <Redirect to="/dashboard"></Redirect>} />
        <GuardedRoute path="*" component={() => <div>Not found</div>} />
      </Switch>
    </GuardProvider>
  )
}

export default memo(AppRoutes)