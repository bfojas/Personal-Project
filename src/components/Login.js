import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
// import axios from 'axios';

class Login extends Component{

    login(){
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback')
        window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`
      }


    render(){
        console.log('user', this.props.user)
        return(
            this.props.user
            ?
            <div>
            {this.props.history.push('/')}
            {/* test */}
            </div>
            :
            <div className='logdiv'>
            <div>
                <h1>Login to enjoy these benefits!</h1>
                <ul>
                    <li>Ability to actually use this app!</li>
                    <li>That's it. That's the only benefit...</li>
                </ul>

            </div>
            <button onClick={this.login}>Log In</button>
            </div>
        )
    }
}

const mapStateToProps= (state)=>{
    return{
        user: state.user
    }
}



export default withRouter(connect(mapStateToProps)(Login))