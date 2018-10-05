import React from "react";
import styled from "styled-components";

import AuthLoginButton from "./AuthLoginButton";

const WelcomeSplash = props => (
  <WelcomeSplashStyled>
    <h2>Welcome to rainchecks!</h2>
    <p>
      Use me to keep track of those films you&lsquo;d love to watch when you
      have some free time.
    </p>
    <p>
      Just log in with your Google account to start saving some movie ideas for
      those rainy days!
    </p>
    <div className="welcome-splash__login-box">
      <AuthLoginButton
        onClick={props.login}
        icon="google"
        accentColor="#4285f4"
      >
        Sign in with Google
      </AuthLoginButton>
    </div>
  </WelcomeSplashStyled>
);

const WelcomeSplashStyled = styled.div`
  color: #fff;
  padding: 20px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;

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

export default WelcomeSplash;
