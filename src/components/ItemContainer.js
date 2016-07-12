import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItem } from '../actions';

import * as actions from '../actions';
import ItemList from '../components/ItemList';

class ItemsContainer extends Component {

  
  render() {
    const { deleteItem, items } = this.props;
    return (
      <ItemList
        items={items}
        onDeleteClick={deleteItem} 
      />
    );
  };
}

const mapStateToProps = (state) => {
  return {
    items: {}
  };
};

ItemsContainer = connect(
  mapStateToProps,
  actions
)(ItemsContainer);

export default ItemsContainer;
