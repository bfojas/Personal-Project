import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient("http://localhost:4000")

export class Game extends Component{
    constructor(){
        super();
        this.state = {
            user: '',
            fromServer: '',
            betInput: 5,
            buttonDisable: true,
            timer: 0

        }
        socket.on('messageFromServer', message => {
            console.log('socket message', message)
            this.setState({
              fromServer: message[0],
              buttonDisable: false
            })
          })

        socket.on('timer', countdown=>{
            this.setState({timer: countdown.countdown})
          })
    }
    lower = ()=>{
        this.setState({buttonDisable: true})
    }
    higher = () =>{
        this.setState({buttonDisable: true})
    }
    raiseBet = ()=>{
        this.setState({betInput: this.state.betInput + 5})
    }
    lowerBet = ()=>{
        this.setState({betInput: this.state.betInput - 5})
    }
    render(){

        return(
            <div>
                <div>This is the Game Component
                Socket test: 
                {this.state.timer}
                {this.state.fromServer && this.state.fromServer.code}
                </div>
                <img src={this.state.fromServer && this.state.fromServer.image} alt={this.state.fromServer && this.state.fromServer.code}/>
                <div>
                    <button onClick={()=>this.lower()} disabled={this.state.buttonDisable}>
                        Lower
                    </button>
                    <button onClick={()=>this.higher()} disabled={this.state.buttonDisable}>
                        Higher
                    </button>
                </div>
                <div>
                    <input value={this.state.betInput} onChange={e=>this.setState({betInput: e.target.value})}/>
                </div>
                <div>
                    <button onClick={()=>this.raiseBet()} disabled={this.state.buttonDisable}>Bet +5</button>
                    <button onClick={()=>this.lowerBet()} disabled={this.state.buttonDisable}>Bet -5</button>
                </div>
            </div>
        )
    }


}

const mapStateToProps= (state)=>{
    return{
        user: state.user,
        credit: state.credit
    }
}

export default withRouter(connect(mapStateToProps)(Game))