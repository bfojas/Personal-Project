import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header';
import routes from './routes'

// const socket = socketIOClient("http://localhost:4000")

class App extends Component {



  render() {
    return (
      <div className="App">
        <Header/>
        <div className = 'routeParent'>{routes}</div>
      </div>
    );
  }
}

export default App;
