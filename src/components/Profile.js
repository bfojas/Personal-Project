import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {logOutUser, updateColor} from '../ducks/reducer';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';

class Profile extends Component{
    

    logout=()=> {
        let yes=window.confirm('Are you sure you want to log out?')
        if(yes=== true)
        {axios.post('/api/logout').then(() => {
          this.props.logOutUser('');
        })
        .then(setTimeout(()=>this.props.history.push('/'),500))}

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
                '#36A2EB',
                '#FF6384',
                '#FF6384'
                ],
                hoverBackgroundColor: [
                '#36A2EB',
                '#FF6384',
                '#FF6384'
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
            <div className="profileParent">
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
                                <div>Bank: {bank} </div>
                                <div>Wins: {wins}</div>
                                <div>Games: {games}</div>
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
                            <button>Delete your Profile</button>
                        </NavLink>
                        <NavLink className="navLink" onClick={this.logout} to="/">
                            <button>Log Out</button>
                        </NavLink>
                    </div>
                    <div className="profileButtonsTwo">
                        <NavLink className="navLink" to="/edit">
                            <button>Edit your Profile</button>
                        </NavLink>
                        <NavLink className="navLink" to="/credits">
                            <button>Purchase Credits</button>
                        </NavLink>
                    </div>
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