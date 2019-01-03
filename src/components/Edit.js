import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {userName, changeEmail, changeImage} from '../ducks/reducer';
import axios from 'axios';


class Edit extends Component{
    constructor(props){
        super(props)
        this.state={
            editUser: '',
            editEmail: '',
            editImage: '',
        }

    }
    editName = (value,)=>{
        this.props.userName(value)
        axios.put('/api/edit/name', {value, auth0_id: this.props.auth0_id}).then(res=> console.log(res))
    }
    editEmailAddress = (value,)=>{
        this.props.changeEmail(value)
        axios.put('/api/edit/email', {value, auth0_id: this.props.auth0_id}).then(res=> console.log(res))
    }
    editUserImage = (value,)=>{
        this.props.changeImage(value)
        axios.put('/api/edit/image', {value, auth0_id: this.props.auth0_id}).then(res=> console.log(res))
    }

    render(){

        return (
            <div>
                <div className="userEditDiv">
                    <input value={this.state.editUser} onChange={e=>this.setState({editUser: e.target.value})}/>
                    <button onClick={()=>this.editName(this.state.editUser)}>Edit Name</button>
                </div>
                <div className="userEditDiv">
                    <input value={this.state.editEmail} onChange={e=>this.setState({editEmail: e.target.value})}/>
                    <button onClick={()=>this.editEmailAddress(this.state.editEmail)}>Edit Email</button>
                </div>
                <div className="userEditDiv">
                    <input value={this.state.editImage} onChange={e=>this.setState({editImage: e.target.value})}/>
                    <button onClick={()=>this.editUserImage(this.state.editImage)}>Edit ImageURL</button>
                </div>



            </div>
        )


    }
}

const mapStateToProps= (state)=>{
    return{
        user: state.user,
        image: state.image,
        email: state.image,
        auth0_id: state.auth0_id
    }
}

const mapDispatchToProps = {
    userName: userName,
    changeEmail: changeEmail,
    changeImage: changeImage
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edit))