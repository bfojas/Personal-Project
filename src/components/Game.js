import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Login from './Login'
import {updateBank} from '../ducks/reducer'
let socket='';
export class Game extends Component{
    
        
    constructor(props){
        super(props);
        this.state = {
            // user: this.props.user,
            fromServer: '',
            betInput: 5,
            buttonDisable: true,
            timer: 0,
            socketId:'',
            winners: [],
            bank: 0
        }
        
        if(this.props){
            socket = socketIOClient("http://localhost:4000")
            }
            else{
                socket = '';
            }

        // receive card and activate button
        socket.on('messageFromServer', message => {
            console.log('socket message', message)
            if (message.length){
            this.setState({
              fromServer: message[0],
              buttonDisable: false
            })}
          })
        
          //receive winners list
        socket.on('winners', list =>{
            console.log('winner hit',list)
            this.setState({
                winners: list
            })
        })
        
        //receive socket id
        socket.on('socketId', message =>{
            console.log('id message', message)
            this.setState({socketId: message})
        })

        //receive bank
        socket.on('bank', bank=>{
            console.log('bank hit', bank)
            props.updateBank(bank)
        })

        //receive timer
        socket.on('timer', countdown=>{
            this.setState({timer: countdown.countdown})
          })
    };
    componentDidMount=()=>{
        // if (this.props.auth0_id){
        socket.on('connect', ()=>{
        setTimeout(()=>{
        console.log('mount hit', this.props.auth0_id)        
        socket.emit('user',{user: this.props.auth0_id})},500)
        })
    }

    componentWillUnmount=()=>{
        socket.disconnect()
    }
    placeBet = (value)=>{
        let {betInput} = this.state
        let betAmount=0;
        betInput < 1
        ?
        betAmount = 0
        :
        betAmount = betInput;
        this.setState({buttonDisable: true})
        socket.emit('bet', {auth0_id: this.props.auth0_id, bet: betAmount, value: value})
    }
    raiseBet = ()=>{
        this.setState({betInput: this.state.betInput + 5})
    }
    lowerBet = ()=>{
        this.state.betInput >5
        ?
        this.setState({betInput: this.state.betInput - 5})
        :
        this.setState({betInput: 0})
    }
    render(){
        console.log('bank', this.state.bank)
        const {timer, fromServer, buttonDisable, betInput} = this.state;
        const winnerList = this.state.winners.map(winners=>{
            return <p>{winners.name}</p>
        })
        return(
            
            !this.props.user.length
            ?
            <div>
                <Login/>
            </div>
            :
            <div className = 'gameParent'>
                <div className= "gameContent">
                    <div>
                    Socket test: 
                    {timer}
                    {fromServer && fromServer.code}
                    </div>
                    <img src={fromServer && fromServer.image} alt={fromServer && fromServer.code}/>
                    <div>
                        <button onClick={()=>this.placeBet('low')} disabled={buttonDisable}>
                            Lower
                        </button>
                        <button onClick={()=>this.placeBet('high')} disabled={buttonDisable}>
                            Higher
                        </button>
                    </div>
                    <div>
                        <input type="number" min="0" value={betInput} onChange={e=>this.setState({betInput: e.target.value})}/>
                    </div>
                    <div>
                        <button onClick={()=>this.lowerBet()} disabled={buttonDisable}>Bet -5</button>
                        <button onClick={()=>this.raiseBet()} disabled={buttonDisable}>Bet +5</button>
                    </div>
                </div>
                <div>
                    <div>
                        {this.props.bank}
                    </div>
                    <div>
                        <p>Winners:</p>
                        <div>{winnerList}</div>
                    </div>
                </div>
            </div>
            
        )
    }


}

const mapStateToProps= (state)=>{
    return{
        user: state.user,
        credit: state.credit,
        auth0_id: state.auth0_id,
        bank: state.bank
    }
}

const mapDispatchToProps = {
    updateBank: updateBank
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game))