import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Edit from './components/Edit';
import DeleteUser from './components/DeleteU';

export default(
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/edit" component={Edit}/>
        <Route path="/delete" component={DeleteUser}/>"
        <Route path="/" component={Home}/>

    </Switch>


)