import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
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
        axios.post('/api/creditcheck', {token, user})
        .then(res=>{
            axios.post('/api/creditadd', {user})
            alert('Thank You! Identity Stolen! (just kidding)')
        })
    }

    stripeRedirect = () =>{
        this.props.history.push('/')}
    

    render(){
        const {addCredit} = this.state
        const {email} = this.props
        return(
            <div>
                <h1>Want to put some credits in your bank?</h1>
                <p>You can get 100 credits for $1. How many credits do you want?</p>
                <div>
                    <input type="text" value={addCredit} 
                        onChange={e=>this.setState({addCredit:e.target.value})} />
                </div>
                <StripeCheckout
                    ComponentClass = "stripe"
                    email = {email}
                    amount={addCredit}
                    name= "Get Credits!"
                    description="Warning: This is a project site"
                    zipCode={true}
                    token = {this.onToken(this.getUser())}
                    allowRememberMe={false}
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