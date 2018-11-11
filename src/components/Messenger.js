import React from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";

import * as actions from "../actions";

class Messenger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      beginClose: false
    };

    this.myRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    var self = this;

    if (
      this.props.messenger !== prevProps.messenger &&
      this.props.messenger.visible
    ) {
      setTimeout(() => {
        // TEST FIRING MULTIPLE MESSAGES (ONE BEFORE THE LAST HAS HIDDEN), MAYBE BLOCK ABOVE IN IF

        self.myRef.current.addEventListener(
          "animationend",
          function hideMessengerFromDom(e) {
            console.log("2: hideMessengerFromDom");
            // console.log("this", this);
            // console.log("self", self);
            self.props.hideMessenger();
            e.currentTarget.removeEventListener(e.type, hideMessengerFromDom);
            self.setState({
              beginClose: false
            });
          }
        );

        console.log("1: setState:beginClose = true");
        this.setState({
          beginClose: true
        });
      }, 4000);
    }
  }

  render() {
    // debugger;
    const { beginClose } = this.state;
    const { message, title, visible } = this.props.messenger;

    if (!visible) return null;

    return (
      <MessengerStyled
        className={beginClose ? "slide-out" : ""}
        innerRef={this.myRef}
      >
        <div>
          <i className="fa fa-exclamation-triangle" />
          <div>
            {title && <h3>{title}</h3>}
            <span>{message}</span>
          </div>
        </div>
      </MessengerStyled>
    );
  }
}

const slideInAnimation = keyframes`
  0% {
    transform: translateY(-150%);
  }
  100% {
    transform: translateY(0);
  }
`;

const slideOutAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-150%);
  }
`;

const MessengerStyled = styled.div`
  animation: ${slideInAnimation} 0.5s ease-out;
  position: fixed;
  top: 16px;
  left: 64px;
  width: calc(100% - 128px);
  z-index: 9999;

  &.slide-out {
    animation: ${slideOutAnimation} 0.5s ease-in;
    animation-fill-mode: forwards;
  }

  i {
    color: #ff8a00; /* Complimentary Orange TODO: Move into global theme */
    margin-right: 16px;
    font-size: 24px;
  }

  & > div {
    max-width: 668px;
    margin: 0 auto;
    background: white;
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.4);
    padding: 16px;
    border-radius: 6px;
    font-size: 16px;
    display: flex;
    align-items: start;
  }

  h3 {
    font-size: 16px;
  }
`;

const mapStateToProps = ({ messenger }) => {
  return {
    messenger
  };
};

const ConnectedMessenger = connect(
  mapStateToProps,
  actions
)(Messenger);

export default ConnectedMessenger;
