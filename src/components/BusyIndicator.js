import React from "react";
import styled, { keyframes } from "styled-components";

class BusyIndicator extends React.PureComponent {
  render() {
    return (
      <BusyIndicatorStyled>
        <div className="rainy" />
      </BusyIndicatorStyled>
    );
  }
}

const rainyAnimation = keyframes`
  50% { transform: translateY(-5px); }
`;

const rainyShadowAnimation = keyframes`
  50% {
    transform: translateY(5px) scale(1);
    opacity: 0.05;
  }
`;

const rainySnowAnimation = keyframes`
  0% {
    box-shadow: rgba(0, 0, 255, 0) 20px 40px, rgba(0, 0, 255, 0) 40px 50px, #31abe1 55px 75px, #31abe1 85px 50px, #31abe1 100px 100px;
  }
  25% {
    box-shadow: #31abe1 20px 45px, #31abe1 40px 60px, #31abe1 55px 90px, #31abe1 85px 65px, rgba(0, 0, 255, 0) 100px 110px;
  }
  26% {
    box-shadow: #31abe1 20px 45px, #31abe1 40px 60px, #31abe1 55px 90px, #31abe1 85px 65px, rgba(0, 0, 255, 0) 100px 50px;
  }
  50% {
    box-shadow: #31abe1 20px 70px, #31abe1 40px 80px, rgba(0, 0, 255, 0) 55px 110px, #31abe1 85px 80px, #31abe1 100px 60px;
  }
  51% {
    box-shadow: #31abe1 20px 70px, #31abe1 40px 80px, rgba(0, 0, 255, 0) 55px 55px, #31abe1 85px 80px, #31abe1 100px 60px;
  }
  75% {
    box-shadow: #31abe1 20px 95px, #31abe1 40px 100px, #31abe1 55px 60px, rgba(0, 0, 255, 0) 85px 95px, #31abe1 100px 80px;
  }
  76% {
    box-shadow: #31abe1 20px 95px, #31abe1 40px 100px, #31abe1 55px 60px, rgba(0, 0, 255, 0) 85px 45px, #31abe1 100px 80px;
  }
  100% {
    box-shadow: rgba(0, 0, 255, 0) 20px 110px, rgba(0, 0, 255, 0) 40px 110px, #31abe1 55px 75px, #31abe1 85px 50px, #31abe1 100px 100px;
  }
`;

const BusyIndicatorStyled = styled.div`
  position: absolute;
  top: 0;
  margin: 0 auto;
  width: 95px;
  height: 100px;
  left: 50%;
  margin-left: -47px;
  top: 40px;

  .rainy {
    animation: ${rainyAnimation} 5s ease-in-out infinite 1s;
    background: #ccc;
    border-radius: 50%;
    box-shadow: #ccc 3px -11px 0 -5px, #ccc 18px -11px, #ccc 12px 0px,
      #ccc 22px 5px 0 -5px, #ccc 30px 2px 0 -2px;
    display: block;
    height: 25px;
    width: 25px;
    position: absolute;
    left: 20px;
    top: 40px;

    &:after {
      animation: ${rainyShadowAnimation} 5s ease-in-out infinite 1s;
      background: #000;
      border-radius: 50%;
      content: "";
      height: 18px;
      width: 50px;
      opacity: 0.08;
      position: absolute;
      left: 2px;
      bottom: -32px;
      transform: scale(0.8);
    }

    &:before {
      animation: ${rainySnowAnimation} 1s infinite linear;
      content: "";
      border-radius: 50%;
      display: block;
      height: 12px;
      width: 12px;
      opacity: 0.8;
      transform: scale(0.4);
    }
  }
`;

export default BusyIndicator;
