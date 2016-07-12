import React, { Component } from 'react';
import ItemContainer from './ItemContainer';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Rain checks for a sunny day.</h1>
        <ItemContainer />
      </div>
    );
  }
}
