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
    const {
      archiveItem,
      unarchiveItem,
      deleteItem,
      items,
      isFetching
    } = this.props;

    return (
      <div>
        {isFetching ? (
          <div className="spinner spinner-dark">
            <span className="spinner__text">Loading...</span>
          </div>
        ) : (
          <ItemList
            items={items}
            onArchiveClick={archiveItem}
            onUnarchiveClick={unarchiveItem}
            onDeleteClick={deleteItem}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ items, isFetching }) => {
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
