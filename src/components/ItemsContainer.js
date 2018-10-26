import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../actions";

import ItemList from "../components/ItemList";

class ItemsContainer extends Component {
  render() {
    const {
      archiveItem,
      unarchiveItem,
      deleteItem,
      items,
      isAddingItem
    } = this.props;

    return (
      <ItemList
        items={items}
        onArchiveClick={archiveItem}
        onUnarchiveClick={unarchiveItem}
        onDeleteClick={deleteItem}
        isAddingItem={isAddingItem}
      />
    );
  }
}

const mapStateToProps = ({ items, isAddingItem }) => {
  return {
    items,
    isAddingItem
  };
};

const ConnectedItemsContainer = connect(
  mapStateToProps,
  actions
)(ItemsContainer);

export default ConnectedItemsContainer;
