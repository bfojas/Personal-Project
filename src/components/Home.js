import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import Login from './Login';
import Game from './Game';


export function Home() {



        return (
            this.props.auth0_id?
            <div>
                <Game/>
            </div>:
            <div>
                <Login/>
            </div>
        )
    }


const mapStateToProps = (state) =>{
    return{
        auth0_id: state.auth0_id
    }
}

export default withRouter(connect(mapStateToProps)(Home))