import React from 'React';
import {connect} from 'react-redux';
import {withRouter, NavLink} from 'react-router-dom';
import logOutUser from '../ducks/reducer';
import axios from 'axios';


export class Delete extends Component{
    delete=()=>{
        axios.delete(`api/delete/${this.props.auth0_id}`).then(()=>
        this.props.logOutUser(''))
    }
    render(){
        return(
            <div>
                <h1>Are you sure you want to delete your profile?</h1>
                <p>Deleting your profile means your bank is gone and you are broke.</p>
                <div className="deleteButtons">
                    <NavLink to="/profile">
                        <button>Nah. Cancel</button>
                    </NavLink>
                    <NavLink onClick={this.delete} to="/login">
                        <button>Yes. Do it!</button>
                    </NavLink>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    auth0_id: state.auth0_id
}
const mapDispatchToProps ={
    logOutUser: logOutUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Delete))
