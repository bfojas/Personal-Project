import React, { Component } from 'react';
import axios from 'axios';
import {CardElement, injectStripe} from 'react-stripe-elements';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';


class CheckoutForm extends Component{
    constructor(props){
        super(props);
        this.state = {complete: false}
        this.submit = this.submit.bind(this)
    }

    async submit(ev) {
        let {token} = await this.props.stripe.CreateToken({name: "Name"})
        let response = await axios.post("api/charge",{
            tokenId: token.id
        })
    }


    render(){
        return(
            <div>
                Purchase some credits?
                {/* <CardElement/> */}
                <button onClick={this.submit}>Purchase</button>

            </div>
        )
}



}

const mapStateToProps = (state =>{
    return {
        user: state.user
    }
})

export default withRouter(connect(mapStateToProps)(CheckoutForm))