import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header';
import routes from './routes'
import styled from 'styled-components'

class App extends Component {

  render() {
    let vh
    window.addEventListener('resize', () =>{
         vh =window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })

    return (
      <div 
      className="App" 
      style={{height: 100 * vh}}
      >
      
        <Header/>
        <div className = 'routeParent'>{routes}</div>
      </div>
    );
  }
}

export default App;
