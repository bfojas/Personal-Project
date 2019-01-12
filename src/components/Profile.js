import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {logOutUser} from '../ducks/reducer';
import axios from 'axios';
import {NavLink} from 'react-router-dom';

class Profile extends Component{
    
    logout=()=> {
        let yes=window.confirm('Are you sure you want to log out?')
        console.log('logout props', this.props)
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
        return(
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className="profileParent">
                <div className="profile">
                    <div className="imageContainer">
                    <img src={image} onError={(e)=>{e.target.onerror = null; e.target.src="https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}}/>
                    </div>
                    <div className="profileContainer">
                        <h1>Hello {user}!</h1>
                        <div>
                            <div>
                                <div>Email: {email}</div>
                                <div>Stats: 
                                    <ul>
                                        <li>Bank: {bank} </li>
                                        <li>Wins: {wins}</li>
                                        <li>Win Percentage: {winPercent}%</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profileButtons">
                    <div className="profileButtonsOne">
                        <NavLink to="/delete">
                            <button>Delete your Profile</button>
                        </NavLink>
                        <NavLink onClick={this.logout} to="/">
                            <button>Log Out</button>
                        </NavLink>
                    </div>
                    <div className="profileButtonsTwo">
                        <NavLink to="/edit">
                            <button>Edit your Profile</button>
                        </NavLink>
                        <NavLink to="/credits">
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