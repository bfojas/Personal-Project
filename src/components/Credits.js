import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {withRouter, NavLink} from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout'
import {updateStats} from '../ducks/reducer'


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
            .then(credit=>{
                this.props.updateStats({
                    credit: credit.data.credit,
                    wins: this.props.wins,
                    games: this.props.games
                })
            })
            alert('Thank You! Identity Stolen! (just kidding)')
        })
        .catch(res=>{alert('Oopsie!')})
    }

    stripeRedirect = () =>{
        this.props.history.push('/')}
    

    render(){
        const {addCredit} = this.state
        const {email} = this.props
        return(
            !this.props.user.length
            ?
            <div>
            {this.props.history.push('/login')}
            </div>
            :
            <div className="purchaseContainer">
                <div className="purchaseMessage">
                <h1>Want to put some credits in your bank?</h1>
                <p>You can get 100 credits for $1. How many credits do you want?</p>
                </div>
                <div className="creditInput">
                    <div>Amount:</div>
                    <input type="text" value={addCredit} 
                        onChange={e=>this.setState({addCredit:e.target.value})} />
                </div>
                <div className="creditButtons">
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
                        closed ={()=>this.props.history.push('/profile')}
                    />
                    <NavLink className="creditCancel" to="/profile">
                        <button>Cancel</button>
                    </NavLink>
                </div>
            </div>
        )
}



}

const mapStateToProps = (state =>{
    return {
        user: state.user,
        email: state.email,
        auth0_id: state.auth0_id,
        bank: state.bank,
        wins: state.wins,
        games: state.games
    }
})

const mapDispatchToProps ={
    updateStats
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Credits))