import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {NavLink, withRouter} from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout'


class Credits extends Component{
    constructor(props){
        super(props);
        this.state = {addCredit:100}
        // this.submit = this.submit.bind(this)
        // this.onToken = this.onToken.bind(this)
    }
    getUser = ()=>{
        const {addCredit} = this.state
        const {user, email, auth0_id} = this.props
        return { user, email, auth0_id, amount: addCredit}

    }
    onToken  = (user)=>(token)=>{
        console.log('user', user)
        console.log('token',token)
        axios.post('/api/creditcheck', {token, user})
        .then(res=>{console.log('res data', res)
            axios.post('/api/creditadd', {user})
        })
        .then(res=>{
            console.log('done hit', res)
        })
    }

    stripeRedirect = () =>{
    console.log('closed hit')
        this.props.history.push('/')}
    

    render(){
        const {addCredit} = this.state
        const {auth0_id, email} = this.props
        console.log('key',process.env.REACT_APP_STRIPE_KEY)
        return(
            <div>
                <h1>Want to put some credits in your bank?</h1>
                <p>You can get 100 credits for $1. How many credits do you want?</p>
                <div>
                    <input type="text" value={addCredit} 
                        onChange={e=>this.setState({addCredit:e.target.value})} />
                </div>
                <StripeCheckout
                    email = {email}
                    amount={addCredit}
                    name= "Get Credits!"
                    // description="Warning: This is a test checkout for funsies"
                    // zipCode={true}
                    token = {this.onToken(this.getUser())}
                    stripeKey = {process.env.REACT_APP_STRIPE_KEY}
                    closed ={()=>this.props.history.push('/')}
                />

            </div>
        )
}



}

const mapStateToProps = (state =>{
    return {
        user: state.user,
        email: state.email,
        auth0_id: state.auth0_id
    }
})

export default withRouter(connect(mapStateToProps)(Credits))