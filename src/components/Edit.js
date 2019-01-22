import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, NavLink} from 'react-router-dom';
import {editUser, updateColor} from '../ducks/reducer';
import axios from 'axios';
import ReactS3 from 'react-s3'


const config = {
    bucketName: 'dev-fun-bucket',
    region: 'us-east-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET,
  }
class Edit extends Component{
    constructor(props){
        super(props)
        this.state={
            editName: this.props.user,
            editEmail: this.props.email,
            editImage: this.props.image,
            body:[]
        }
    }
    edit = (value)=>{
        this.props.editUser(value)
        axios.put('/api/edit', {value, auth0_id: this.props.auth0_id}).then()
    }
    colorToDb = (color)=>{
        axios.put('/api/color', {color, auth0_id: this.props.auth0_id})
        .then(res=>this.props.updateColor(res.data))
        // .then(res=>console.log('color', this.props.color))
    }
    selectImage = async (e) =>{
        console.log('taget', e.target.files[0])
        let uploaded = await e.target.files[0]
        this.setState({body : uploaded})
        console.log('state', this.state.body)
    }

   

    uploadImage = ()=>{
        const {user, auth0_id, email} = this.props
        
        ReactS3.uploadFile(this.state.body, config)
        .then(data=>{
        axios.put('/api/upload', {image: data.location,
             auth0_id: auth0_id,
            name: user,
            email: email})
            .then(this.props
                .editUser({image: data.location,
                auth0_id: auth0_id,
               name: user,
               email: email}))
        })
        .catch(err=> {alert(err)})  
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
                        e.target.src="images/unavailable.jpg"}}
                        alt="User"/>
                    <div className="uploadContainer">
                        <div className="uploadText">Upload Profile Image</div>
                        <div className="uploadButtons">
                        <input type="file" id="selectedFile" 
                        // style={{visibility: 'hidden'}} 
                        style={{display:'none'}} 
                        onChange={this.selectImage}/>
                        <label for='selectedFile'>Select File</label>
                        {/* <input type="button" value="Browse..." onclick="document.getElementById('selectedFile').click();" /> */}
                        <NavLink className="upload" onClick={this.uploadImage} to="/profile">
                            <button className="uploadButton" >Upload</button>
                        </NavLink>
                        </div>
                    </div>
                </div>
                <div className="infoEdit">
                    <div className="userEditDiv">
                        <div>Username: </div>
                        <input value={this.state.editName} 
                        onChange={e=>this.setState({editName: e.target.value})}/>
                    </div>
                    <div className="userEditDiv">
                        <div>E-mail: </div>
                        <input value={this.state.editEmail} 
                        onChange={e=>this.setState({editEmail: e.target.value})}/>
                    </div>
                    <div className="userEditDiv">
                        <div>Image Url: </div>
                        <input value={this.state.editImage} 
                        onChange={e=>this.setState({editImage: e.target.value})}/>
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
                            <div className="colorOne" style={{backgroundColor: 'green'}} onClick={()=>this.colorToDb('green')}></div>
                            <div className="colorTwo" style={{backgroundColor:'grey'}} onClick={()=>this.colorToDb('grey')}></div>
                            <div className="colorThree" style={{backgroundColor:'#1A5387'}} onClick={()=>this.colorToDb('#1A5387')}></div>
                            <div className="colorFour" style={{backgroundColor: '#871D0C'}}onClick={()=>this.colorToDb('#871D0C')}></div>
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