import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../actions";

import ItemList from "../components/ItemList";

class ItemsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Load movie list data
    this.props.initializeItemsList();
  }

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

ItemsContainer = connect(
  mapStateToProps,
  actions
)(ItemsContainer);

export default ItemsContainer;
