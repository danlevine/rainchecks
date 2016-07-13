import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initializeItemsList, deleteItem } from '../actions';

import * as actions from '../actions';
import ItemList from '../components/ItemList';

class ItemsContainer extends Component {

  componentDidMount() {
    this.props.initializeItemsList();
  }

  render() {
    const { deleteItem, items, isFetching } = this.props;
    if (isFetching) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <ItemList
        items={items}
        onDeleteClick={deleteItem} 
      />
    );
  };
}

const mapStateToProps = ({items, isFetching}) => {
  return {
    items,
    isFetching
  };
};

ItemsContainer = connect(
  mapStateToProps,
  actions
)(ItemsContainer);

export default ItemsContainer;