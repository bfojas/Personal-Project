import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import Header from './components/Header';
import routes from './routes'

// const socket = socketIOClient("http://localhost:4000")

class App extends Component {



  render() {
    return (
      <div className="App">
        <div><Header/></div>
        <div className = 'routeParent'>{routes}</div>
      </div>
    );
  }
}

export default App;
