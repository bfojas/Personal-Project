import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header';
import routes from './routes'
import styled from 'styled-components'

// const socket = socketIOClient("http://localhost:4000")

class App extends Component {



  render() {
    return (
      <AppWrap>
      <div 
      className="App">
        <Header/>
        <div className = 'routeParent'>{routes}</div>
      </div>
      </AppWrap>
    );
  }
}

const AppWrap = styled.div`
  height: window.innerHeight;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`
export default App;
