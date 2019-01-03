import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Game from './components/Game';
import Profile from './components/Profile'
import Edit from './components/Edit'

export default(
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/edit" component={Edit}/>
        <Route path="/" component={Game}/>

    </Switch>


)