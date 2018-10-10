import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import * as actions from "../actions";

class WelcomeSplash extends React.Component {
  componentDidMount() {
    this.props.initAuthBox();
  }

  render() {
    return (
      <WelcomeSplashStyled>
        <h2>Welcome to rainchecks!</h2>
        <p>
          Use me to keep track of those films you&lsquo;d love to watch when you
          have some free time.
        </p>
        <p>
          Just sign in to start saving some movie ideas for those rainy days!
        </p>
        <div className="firebaseui-auth-container" />
      </WelcomeSplashStyled>
    );
  }
}

const WelcomeSplashStyled = styled.div`
  color: #fff;
  padding: 20px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  font-size: 16px;

  h2,
  p {
    margin-bottom: 20px;
  }

  h2 {
    font-size: 30px;
    font-weight: normal;
    line-height: 1;
  }

  .welcome-splash__login-box {
    margin-top: 40px;
  }
`;

const ConnectedWelcomeSplash = connect(
  null,
  actions
)(WelcomeSplash);

export default ConnectedWelcomeSplash;
