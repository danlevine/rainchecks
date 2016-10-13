import React, { Component } from 'react';
import AddItemLauncher from './AddItemLauncher';
import ItemsContainer from './ItemsContainer';
import Header from './Header';


export default class App extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <ItemsContainer />
        <AddItemLauncher />
      </div>
    );
  }
}
