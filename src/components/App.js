import React, { Component } from 'react';
import AddItem from './AddItem';
import ItemsContainer from './ItemsContainer';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Rain checks for a sunny day.</h1>
        <ItemsContainer />
        <AddItem />
      </div>
    );
  }
}
