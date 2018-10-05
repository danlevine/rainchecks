import React from "react";
import styled from "styled-components";

const AuthLoginButton = props => (
  <AuthLoginButtonStyled
    accentColor={props.accentColor}
    onClick={props.onClick}
  >
    <i className={`fa fa-${props.icon}`} />
    {props.children}
  </AuthLoginButtonStyled>
);

const AuthLoginButtonStyled = styled.button`
  background-color: ${props => props.accentColor};
  color: #fff;
  border: 2px solid ${props => props.accentColor};
  border-radius: 4px;
  padding: 15px;
  font-size: 18px;
  cursor: pointer;

  i {
    margin-right: 15px;
  }

  &:active {
    background-color: #fff;
    color: ${props => props.accentColor};
  }

  &:focus {
    outline: none;
    border: 2px dashed #fff;
  }

  &:active:focus {
    border-color: ${props => props.accentColor};
  }
`;

export default AuthLoginButton;
