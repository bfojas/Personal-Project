import React, { Component } from 'react';
import axios from 'axios';
import {Elements, injectStripe} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'
import { connect } from 'react-redux';
import {NavLink, withRouter} from 'react-router-dom';


class Credits extends Component{
    constructor(props){
        super(props);
        this.state = {complete: false}
        // this.submit = this.submit.bind(this)
    }

    

    render(){
        return(
            <div>
               <Elements>
                   {/* <CheckoutForm/> */}
               </Elements>
            </div>
        )
}



}

const mapStateToProps = (state =>{
    return {
        user: state.user
    }
})

export default withRouter(connect(mapStateToProps)(Credits))