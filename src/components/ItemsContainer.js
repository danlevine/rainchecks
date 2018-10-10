import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../actions";

import ItemList from "../components/ItemList";

class ItemsContainer extends Component {
  render() {
    const { archiveItem, unarchiveItem, deleteItem, items } = this.props;

    return (
      <ItemList
        items={items}
        onArchiveClick={archiveItem}
        onUnarchiveClick={unarchiveItem}
        onDeleteClick={deleteItem}
      />
    );
  }
}

const mapStateToProps = ({ items }) => {
  return {
    items
  };
};

const ConnectedItemsContainer = connect(
  mapStateToProps,
  actions
)(ItemsContainer);

export default ConnectedItemsContainer;
