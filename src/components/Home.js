import React from 'react';
import {connect} from 'react-redux';
import {withRouter, NavLink} from 'react-router-dom'


export function Home(props) {
        let logged = false;
        let button = ''
        if(props.auth0_id)
        {logged = '/profile'
        button = "Profile"}
        else{logged = '/login'
        button = 'Log In'};



        return (

            <div className="homeParent">
                <h1>Welcome to my project!</h1>
                <p>This is just a simple game made by a web dev student.<br/>
                Feel free to login and enjoy!</p>
                <div className="rules">
                How to play:
                <ul className="rulesList">
                    <li>A single card is dealt out by the server to everyone.</li>
                    <li>Everyone in the game then has 20 seconds to guess if the next card will be higher or lower</li>
                    <li>You can add a bet amount to your guess if you feel bold enough
                        <ul>
                            <li>Don't worry, it's fake money...</li>
                            <li>Find the add credits button in your profile to add more fake money</li>
                        </ul>
                    </li>
                    <li>There's a chat on the side that show's who won. Feel free to chat with everyone else that's playing!</li>

                </ul>
                </div>
                <div>
                    <NavLink to={logged}>
                        <button>{button}</button>
                    </NavLink>
                    <NavLink to="/game">
                        <button>Play</button>
                    </NavLink>
                </div>
            </div>
        )
    }


const mapStateToProps = (state) =>{
    return{
        auth0_id: state.auth0_id
    }
}

export default withRouter(connect(mapStateToProps)(Home))