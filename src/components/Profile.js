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
        .then(setTimeout(()=>this.props.history.push('/login'),500))}
        
    }
    

    render(){
        return(
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className="logdiv">
                <div>
                    <h1>Hello {this.props.user}!</h1>
                    <div>Email: {this.props.email}</div>
                    <img src={this.props.image} alt = "You"/>
                </div>
                <div>
                    <NavLink to="/delete">
                        <button>Delete your Profile</button>
                    </NavLink>
                    <NavLink onClick={this.logout} to="/">
                        <button>Log Out</button>
                    </NavLink>
                    <NavLink to="/edit">
                        <button>Edit your Profile</button>
                    </NavLink>
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
        auth0_id: state.auth0_id
    }
}

const mapDispatchToProps = {
    logOutUser:logOutUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile))