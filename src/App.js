import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header';
import routes from './routes'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'



  
class App extends Component {
  constructor(){
    super()
    this.state = {screenHeight: window.innerHeight};
  }
  componentDidMount(){
    window.addEventListener('resize', this.updateWindow())
  }


  updateWindow=()=>{
    window.addEventListener('resize', ()=>{
      this.setState({screenHeight: window.innerHeight})
    })
  }

  render() {
    
    
    return (
      
      <div 
      className="App" 
      style={{height: this.state.screenHeight}}
      >
        <Header/>
        <div className = 'routeParent' style={{backgroundColor: this.props.color}}>{routes}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) =>{
  return{
    color: state.color
  }
}

export default withRouter(connect(mapStateToProps)(App));
