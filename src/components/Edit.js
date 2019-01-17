import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, NavLink} from 'react-router-dom';
import {editUser, updateColor} from '../ducks/reducer';
import axios from 'axios';

class Edit extends Component{
    constructor(props){
        super(props)
        this.state={
            editName: this.props.user,
            editEmail: this.props.email,
            editImage: this.props.image,
        }
    }
    edit = (value)=>{
        this.props.editUser(value)
        axios.put('/api/edit', {value, auth0_id: this.props.auth0_id}).then(res=> console.log(res))
    }
    colorToDb = (color)=>{
        axios.put('api/color', {color, auth0_id: this.props.auth0_id})
        .then(res=>this.props.updateColor(res.data))
    }

    render(){
        const {image} = this.props
        return (
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className="editParent">
                <div className="imageContainer">
                <img src={image} 
                onError={(e)=>{e.target.onerror = null; 
                    e.target.src="https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}}
                    alt="User"/>
                </div>
                <div className="infoEdit">
                    <div className="userEditDiv">
                        <div>Username: </div>
                        <input value={this.state.editName} onChange={e=>this.setState({editName: e.target.value})}/>
                    </div>
                    <div className="userEditDiv">
                        <div>E-mail: </div>
                        <input value={this.state.editEmail} onChange={e=>this.setState({editEmail: e.target.value})}/>
                    </div>
                    <div className="userEditDiv">
                        <div>Image Url: </div>
                        <input value={this.state.editImage} onChange={e=>this.setState({editImage: e.target.value})}/>
                    </div>
                    <div className="editButtons">
                        <NavLink className="editNav" to="/profile">
                            <button>Cancel</button>
                        </NavLink>
                        <NavLink className="editNav" to="/profile"onClick={()=>this.edit({
                            name: this.state.editName,
                            email: this.state.editEmail,
                            image: this.state.editImage
                        })}>
                            <button >Submit</button>
                        </NavLink>
                    </div>
                    <div className="colorContainer">
                        <div className="colorTitle">Update Theme</div>
                        <div className="colorBox">
                            <div className="colorOne" onClick={()=>this.colorToDb('green')}></div>
                            <div className="colorTwo" onClick={()=>this.colorToDb('grey')}></div>
                            <div className="colorThree" onClick={()=>this.colorToDb('aqua')}></div>
                            <div className="colorFour" onClick={()=>this.colorToDb('red')}></div>
                        </div>
                    </div>
                </div>
                    
            </div>
        )


    }
}

const mapStateToProps= (state)=>{
    return{
        user: state.user,
        image: state.image,
        email: state.email,
        auth0_id: state.auth0_id,
        color: state.color
    }
}

const mapDispatchToProps = {
    editUser: editUser,
    updateColor: updateColor
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edit))