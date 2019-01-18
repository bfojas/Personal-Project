import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import {updateStats} from '../ducks/reducer'
import { Doughnut } from 'react-chartjs-2';

let socket='';
export class Game extends Component{
    constructor(props){
        super(props);
        this.state = {
            fromServer: '',
            betInput: 5,
            buttonDisable: true,
            timer: 0,
            socketId:'',
            winners: [],
            bank: 0,
            chatMessages:[],
            messageText:''
        }
        
        if(this.props){
            process.env.REACT_APP_SOCKET ==="localhost"
            ?socket = socketIOClient("http://localhost:4000")
            :socket = socketIOClient()
            }
            else{
                socket = '';
            }

        // receive card and activate button
        socket.on('messageFromServer', message => {
            if (message.length){
            this.setState({
              fromServer: message[0],
              buttonDisable: false
            })}
          })
        
          //receive winners list
        socket.on('winners', list =>{
            this.setState({
                winners: list
            })
        })
        
        //receive socket id
        socket.on('socketId', message =>{
            this.setState({socketId: message})
        })

        //receive bank
        socket.on('stats', stats=>{
            props.updateStats(stats)
        })

        //receive timer
        socket.on('timer', countdown=>{
            this.setState({timer: countdown.countdown})
        })

        //receive messages
        socket.on('message', message=>{
            let updated= [...this.state.chatMessages, message]
            if(updated.length > 30) 
            {updated.shift()}
            this.setState({chatMessages:updated})
        })
    };

    componentDidMount=()=>{
        socket.on('connect', ()=>{
        setTimeout(()=>{
        socket.emit('user',{user: this.props.auth0_id})},500)
        })
    };

    componentWillUnmount=()=>{
        socket.disconnect();
    };
    handleKey =(e)=>{
        const {code} = e;
        if (this.state.buttonDisable === true)
        {return null}
        else if (code === "ArrowRight")
        {this.raiseBet()}
        else if(code === "ArrowLeft")
        {this.lowerBet()}
        else if (code === 'ArrowUp')
        {this.placeBet('high')}
        else if (code === 'ArrowDown')
        {this.placeBet('low')}
    }
    placeBet = (value)=>{
        let {betInput} = this.state
        let betAmount=0;
        betInput < 1
        ?betAmount = 0
        :betInput > this.props.bank
        ?betAmount = this.props.bank
        :betAmount = betInput;
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
        if (text.length){
        socket.emit('chatSend', {text:text, user:this.props.user, key:Date.now()});
        this.setState({messageText:''})}
    }

    handleKey = (e) => {
        const {key} = e;
        if (this.state.buttonDisable === true)
        {return null}
        else if (key === "ArrowRight")
        {this.raiseBet()}
        else if(key === "ArrowLeft")
        {this.lowerBet()}
        else if (key === 'ArrowUp')
        {this.placeBet('high')}
        else if (key === 'ArrowDown')
        {this.placeBet('low')}
    }

    
    render(){
        const {timer, fromServer, buttonDisable, betInput, chatMessages, messageText} = this.state;
        const displayChat =
            chatMessages.map(chats=>{
            return <div className="chatMessage" key={`${chats.key}${chats.user}`}>
                <div className="chatUser" style={{color: this.props.color}}>{chats.user}:</div>
                <div className="chatText">{chats.text}</div>
            </div>
        })
        const chartPercent = [20-timer, timer]
        const data = {
            labels: [
                'Time',
                '',
            ],
            datasets: [{
                data: chartPercent,
                backgroundColor: [
                '#FF6384',
                '#36A2EB'
                ],
                hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
                ]
            }]
        };
        let windowWatch=115;
        
        return(
            
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className = 'gameParent' onKeyDown={(e) => this.handleKey(e)} tabIndex="0">
                <div className= "gameContent">
                    <div className="gameInfoContainer">
                        <div className="timerContainer">
                            <div className="timer">Time<br/>{timer}</div>
                            <Doughnut className="chartTimer"
                            height={windowWatch}
                            width={windowWatch}
                            data={data}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                legend:{display: false},
                                cutoutPercentage:80
                            }}
                            />
                        </div>
                        <div className="bankContainer">
                            <div>Bank:</div>
                            <div>{this.props.bank}</div>
                        </div>
                    </div>
                    <div className="cardImageContainer">
                        <img className="cardImage" src={fromServer && fromServer.image}
                            onError={(e)=>{e.target.onerror = null; 
                                e.target.src=fromServer.altimage}}
                            alt={fromServer && fromServer.code}/>
                    </div>
                    <div className="betContainer">               
                        <div className="bet">
                            <div>Bet Amount: </div>
                            <input className="betInput" type="number" 
                                min="0" 
                                max={this.props.bank}
                                value={betInput} 
                                onChange={e=>this.setState({betInput: e.target.value})}/>
                        </div>
                        <div className="betButtonContainer">
                            <div className="betButtons">
                                <button onClick={()=>this.lowerBet()} disabled={buttonDisable}>Bet -5</button>
                                <button onClick={()=>this.raiseBet()} disabled={buttonDisable}>Bet +5</button>
                            </div>
                            <div className="betButtons">
                                <button onClick={()=>this.placeBet('low')} disabled={buttonDisable}>
                                    Lower
                                </button>
                                <button onClick={()=>this.placeBet('high')} disabled={buttonDisable}>
                                    Higher
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chatContent">
                    <div className="chatWindow" >
                        {chatMessages.length
                        ?displayChat
                        :<div></div>}
                    </div>
                    <div className="chatInput">
                        <input type="text" value={messageText} 
                        onChange={e=>this.setState({messageText:e.target.value})}
                        onKeyDown={e=>{if(e.keyCode===13) {this.sendMessage(messageText)}}} />
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
        bank: state.bank,
        color: state.color
    }
}

const mapDispatchToProps = {
    updateStats: updateStats
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game))