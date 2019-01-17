import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, NavLink} from 'react-router-dom';
import {logOutUser} from '../ducks/reducer';
import axios from 'axios';


class DeleteUser extends Component{
    delete=()=>{
        axios.delete(`/api/delete/${this.props.auth0_id}`).then(()=>
        this.props.logOutUser(''))
    }
    render(){
        return(
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className="deleteContainer">
                <h1>Are you sure you want to delete your profile?</h1>
                <p>Deleting your profile means your bank is gone and you are broke.</p>
                <div className="deleteButtons">
                    <NavLink className="deleteButts" to="/profile">
                        <button>Nah. Cancel</button>
                    </NavLink>
                    <NavLink className="deleteButts" onClick={this.delete} to="/login">
                        <button>Yes. Do it!</button>
                    </NavLink>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    return{
    auth0_id: state.auth0_id,
    user: state.user
    }
}
const mapDispatchToProps ={
    logOutUser: logOutUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeleteUser))
