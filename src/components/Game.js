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
            bank: 0,
            chatMessages:['test'],
            messageText:''
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

        //receive messages
        socket.on('message', message=>{
            console.log('message emitted')
            let updated= [...this.state.chatMessages, message]
            if(updated.length > 10) 
            {updated.shift()}
            this.setState({chatMessages:updated})
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

    sendMessage = (text)=>{
        console.log('text', text)
        if (text.length){
        socket.emit('chatSend', {text:text, user:this.props.user});
        this.setState({messageText:''})}
    }
    render(){
        console.log('bank', this.state.bank)
        const {timer, fromServer, buttonDisable, betInput, chatMessages, messageText} = this.state;
        const displayChat = chatMessages.map(chats=>{
            return <div className="chatMessage">
                <div className="chatUser">{chats.user}:</div>
                <div className="chatText">{chats.text}</div>
            </div>
        })
        const winnerList = this.state.winners.map(winners=>{
            return <p>{winners.name}</p>
        })
        return(
            
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className = 'gameParent'>
                <div className= "gameContent">
                    <div className="gameInfoContainer">
                        <div className="timerContainer">
                            <div>Time Remaining:</div>
                            <div>{timer}</div>
                        </div>
                        <div className="bankContainer">
                            <div>Bank:</div>
                            <div>{this.props.bank}</div>
                        </div>
                    </div>
                    <div classname="cardImageContainer">
                        <img className="cardImage" src={fromServer && fromServer.image} alt={fromServer && fromServer.code}/>
                    </div>
                    <div classname="betContainer">               
                        <div>
                            <input type="number" 
                                min="0" 
                                max={this.props.bank}
                                value={betInput} 
                                onChange={e=>this.setState({betInput: e.target.value})}/>
                        </div>
                        <div >
                            <button onClick={()=>this.lowerBet()} disabled={buttonDisable}>Bet -5</button>
                            <button onClick={()=>this.raiseBet()} disabled={buttonDisable}>Bet +5</button>
                        </div>
                        <div>
                            <button onClick={()=>this.placeBet('low')} disabled={buttonDisable}>
                                Lower
                            </button>
                            <button onClick={()=>this.placeBet('high')} disabled={buttonDisable}>
                                Higher
                            </button>
                        </div>
                    </div>
                </div>
                <div className="chatContent">
                    <div className="chatWindow">
                        {displayChat}
                    </div>
                    <div className="chatInput">
                        <input type="text" value={messageText} 
                        onChange={e=>this.setState({messageText:e.target.value})}
                        onKeyDown={e=>{if(e.keyCode==13) {this.sendMessage(messageText)}}} />
                        <button onClick={()=>this.sendMessage(messageText)}>Send</button>
                        
                        
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