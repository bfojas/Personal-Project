import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {logOutUser} from '../ducks/reducer';
import axios from 'axios';
import {NavLink} from 'react-router-dom'


class Profile extends Component{
    
    logout=()=> {
        console.log('logout props', this.props)
        axios.post('/api/logout').then(() => {
          this.props.logOutUser('');
        });
    }

    render(){
        console.log('logout props', this.props)
        return(
            <div className="logdiv">
                <div>
                    <h1>Hello {this.props.user}!</h1>
                    <div>Email: {this.props.email}</div>
                    <img src={this.props.image} alt = "You"/>
                </div>
                <div>
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
        image: state.image
    }
}

const mapDispatchToProps = {
    logOutUser:logOutUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile))