import React, { Component } from 'react';
import AddItem from './AddItem';
import ItemsContainer from './ItemsContainer';
import Header from './Header';


export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <ItemsContainer />
        <AddItem />
      </div>
    );
  }
}
