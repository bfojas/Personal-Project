import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import Login from './Login';
import Game from './Game';


export function Home(props) {



        return (
            props.auth0_id?
            <div className="homeParent">
                <Game/>
            </div>:
            <div className="homeParent">
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