import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {logOutUser, updateColor} from '../ducks/reducer';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';

class Profile extends Component{
    constructor(props){
        super(props)
        this.state={birds: 'none',
            bankFont: '24px'}
    }

componentDidMount(){
    if(this.props.bank.toString().length > 5)
    {this.setState({bankFont: '20px'})}

}

    logout=()=> {
        let yes=window.confirm('Are you sure you want to log out?')
        if(yes=== true)
        {axios.post('/api/logout').then(() => {
          this.props.logOutUser('');
        })
        .then(setTimeout(()=>this.props.history.push('/'),500))}
    }

    birdHandle=(e)=>{
        if(e.key === 'ArrowUp')
        {this.setState({birds: 'block'})}
        else if(e.key === 'ArrowDown')
        {this.setState({birds: 'none'})}
    }
    

    render(){
        const {user, image, email, bank, wins, games} = this.props
        let winPercent, chartPercent;
        if(games === 0)
        {winPercent = 0;
        chartPercent = [0,0,1]}
        else {winPercent = wins / games *100;
            chartPercent = [wins, games-wins,0]}


        const data = {
            labels: [
                'Wins',
                'Losses',
                'Not Played'
            ],
            datasets: [{
                data: chartPercent,
                backgroundColor: [
                'green',
                '#CC4400',
                '#CC4400'
                ],
                hoverBackgroundColor: [
                'green',
                '#CC4400',
                '#CC4400'
                ]
            }]
        };

        
        return(
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className="profileParent" onKeyDown={e=> this.birdHandle(e)} tabIndex="0">
                <div className="userMobile">
                    <div className="mobileHello" >Hello {user}!</div>
                    <div className="mobileEmail">Email: {email}</div>
                </div>
                <div className="imageContainer">
                    <div className="image">
                        <div className="asshole">
                            <img src={image} 
                            onError={(e)=>{e.target.onerror = null; 
                                e.target.src="images/unavailable.jpg"}}
                            alt="User"/>
                        </div>
                        <div className="statsMobile">
                            <div>Bank: {bank}</div>
                            <div>Wins: {wins}</div>
                        </div> 
                    </div>
                    <div className="profileContainer">
                        <div className="profile">
                            <div className="profileGreet">
                            <div className="profileHello">Hello {user}!</div>
                            <div>Email: {email}</div>
                            </div>
                            <div className="stats">
                                <div style={{fontSize: this.state.bankFont}}>Bank:<br/>{bank} </div>
                                <div>Wins:<br/>{wins}</div>
                                <div>Games:<br/>{games}</div>
                            </div>
                        </div>                        
                        <div className="chartDiv">
                            <div className="winPercentage">
                            Win %:<br/>{Math.round(winPercent)}%</div>
                            <Doughnut className="chart"
                            // height='250'
                            // width='250'
                            data={data}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                legend:{display: false}
                            }}
                            />
                        </div>
                    </div>
                </div>
                <div className="profileButtons">
                    <div className="profileButtonsOne">
                        <NavLink className="navLink" to="/delete">
                            <button>Delete Profile</button>
                        </NavLink>
                        <NavLink className="navLink" onClick={this.logout} to="/">
                            <button>Log Out</button>
                        </NavLink>
                    </div>
                    <div className="profileButtonsTwo">
                        <NavLink className="navLink" to="/edit">
                            <button>Edit Profile</button>
                        </NavLink>
                        <NavLink className="navLink" to="/credits">
                            <button>Purchase Credits</button>
                        </NavLink>
                    </div>
                </div>
                <div className="birds" style={{display: this.state.birds}}>
                    <img src='/images/birds.png' alt="birds"/>
                </div>
            </div>
        )
    }
}



const mapStateToProps = (state)=>{
    return {
        user: state.user,
        email: state.email,
        image: state.image,
        auth0_id: state.auth0_id,
        bank: state.bank,
        wins: state.wins,
        games: state.games,
        color: state.color
    }
}

const mapDispatchToProps = {
    logOutUser:logOutUser,
    updateColor: updateColor
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile))