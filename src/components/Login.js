import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import axios from 'axios';

class Login extends Component {
  login() {
    const redirectUri = encodeURIComponent(
      window.location.origin + "/auth/callback"
    );
    window.location = `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/authorize?client_id=${
      process.env.REACT_APP_AUTH0_CLIENT_ID
    }&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`;
  }

  render() {
    return this.props.user ? (
      <div>{this.props.history.push("/profile")}</div>
    ) : (
      <div className="logParent">
        <div className="logHead" />
        <div className="logInfoContainer">
          <h1>Login to enjoy these benefits!</h1>

          <div className="logInfo">
            <ul>
              <li>Ability to actually use this app!</li>
              <li>That's it. That's the only benefit...</li>
            </ul>
            <div
              className="loginPic"
              style={{ backgroundImage: "url('/images/login.jpg')" }}
            />
          </div>
        </div>
        <div className="logButton">
          <button onClick={this.login}>Log In</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(Login));
