import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {logOutUser} from '../ducks/reducer';
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
        let winPercent;
        games === 0
        ?winPercent = 0
        : winPercent = wins / games *100

        const data = {
            labels: [
                'Wins',
                'Losses'
            ],
            datasets: [{
                data: [wins, wins - games],
                backgroundColor: [
                '#36A2EB',
                '#FF6384'
                ],
                hoverBackgroundColor: [
                '#36A2EB',
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
                    <h1>Hello {user}!</h1>
                    <div>Email: {email}</div>
                </div>
                <div className="imageContainer">
                    <div className="image">
                    <img src={image} 
                        onError={(e)=>{e.target.onerror = null; 
                            e.target.src="https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}}
                        alt="User"/>
                    <div className="statsMobile">
                            <ul>
                                <li>Bank: {bank} </li>
                                <li>Wins: {wins}</li>
                            </ul>
                        </div> 
                    </div>
                    <div className="profileContainer">
                        <div className="profile">
                            <h1>Hello {user}!</h1>
                            <div>Email: {email}</div>
                            <ul>
                                <li>Bank: {bank} </li>
                                <li>Wins: {wins}</li>
                            </ul>
                        </div>                        
                        <div className="chartDiv">
                            <div className="winPercentage">
                            Win %:<br/>{winPercent}%</div>
                            <Doughnut className="chart"
                            // height='250'
                            // width='250'
                            data={data}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                legend:{
                                labels:{fontColor: 'black',
                                font: (context)=> {
                                    var width = context.chart.width;
                                    var size = Math.round(width/ 5);
                                    console.log('width', width)
                                    
                                    return {
                                        // weight: 'bold',
                                        size: size
                                    };
                                }}
                            }}}
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
        games: state.games
    }
}

const mapDispatchToProps = {
    logOutUser:logOutUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile))