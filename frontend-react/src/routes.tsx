import React from 'react';

import {
    Switch,
    Route,
  } from "react-router-dom";
import AuthPage from './pages/Auth.page';

const MainRoutes =()=>{
    return(
        <Switch>
             <Route path="/" component={AuthPage}/>
        </Switch>
    )
}

export default MainRoutes