import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header';
import routes from './routes'

// const socket = socketIOClient("http://localhost:4000")

class App extends Component {



  render() {
    const myCustomStyles = {
      height: window.innerHeight
  }
    return (
      <div 
      style={myCustomStyles} 
      className="App">
        <Header/>
        <div className = 'routeParent'>{routes}</div>
      </div>
    );
  }
}

export default App;
