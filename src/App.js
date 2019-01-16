import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header';
import routes from './routes'
import styled from 'styled-components'


  
class App extends Component {
  constructor(){
    super()
    this.state = {screenHeight: window.innerHeight};
  }
  componentDidMount(){
    window.addEventListener('resize', this.updateWindow())
  }


  updateWindow=()=>{
    console.log('test')
    window.addEventListener('resize', ()=>{
      this.setState({screenHeight: window.innerHeight})
      console.log('height2', this.state.screenHeight)
    })
  }

  render() {
    
    
    return (
      
      <div 
      className="App" 
      style={{height: this.state.screenHeight}}>
        <Header/>
        <div className = 'routeParent'>{routes}</div>
      </div>
    );
  }
}

export default App;
