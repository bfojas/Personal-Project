import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {setUser} from '../ducks/reducer';
import {withRouter} from 'react-router-dom';
import axios from 'axios';


class Header extends Component {

    componentDidMount(){
        
        axios.get('/auth/user-data').then(response =>{
            const {name, picture, email, auth0_id, credit, wins, games} = response.data
            this.props.setUser([name, picture, email, auth0_id, credit, wins, games])
          })
    }
    login= ()=>{
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback')
        window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`
      }

    render(){
        var logged = '';
        var logButton = '';
        var play = '';
        if(this.props.user)
            {   
                play='/game'
                logged= '/profile'
                logButton= 'Profile'
            }
            else{
                play= '/login'
                logged= '/login'
                logButton= 'Log In'
            }
            

        return(
            <header>
                <div className="head">
                    <div className="headerImage">
                        <img src="/images/graphic.png" alt="logo"/>
                    </div>

                    <ul>
                        <li>
                            <NavLink to="/">
                                <button>Home</button>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${logged}`}>
                                <button>{`${logButton}`}</button>
                            </NavLink></li>
                        <li>
                            <NavLink to={`${play}`}>
                                <button>Play</button>
                            </NavLink>
                        </li>
                    </ul>

                </div>
            </header>
            )   
    }
}

const mapStateToProps = (state)=>{
    return {
        user: state.user,
        bank: state.bank
    }
}

const mapDispatchToProps = {
    setUser
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
