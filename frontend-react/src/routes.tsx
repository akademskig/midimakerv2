import React from 'react';

import {
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";
import AuthPage from './pages/Auth.page';

const MainRoutes =()=>{
    return(
        <Switch>
             <Route exact path="/" component={() => <Redirect to="/auth"></Redirect>}/>
             <Route path='/auth' component={AuthPage}/>
        </Switch>
    )
}

export default MainRoutes