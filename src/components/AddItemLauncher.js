import React, { Component } from "react";
import { connect } from "react-redux";

import AddItem from "./AddItem";
import * as actions from "../actions";

class AddItemLauncher extends Component {
  render() {
    const { isAddFormActive, activateAddItem, closeAddItem } = this.props;
    if (!isAddFormActive) {
      return (
        <button className="btn-action btn-round" onClick={activateAddItem}>
          <i className="fa fa-plus" />
        </button>
      );
    }

    return (
      <div>
        <AddItem onAddCancel={closeAddItem} />
      </div>
    );
  }
}

const mapStateToProps = ({ addItem, isAddFormActive }) => {
  return {
    isAddFormActive
  };
};

AddItemLauncher = connect(
  mapStateToProps,
  actions
)(AddItemLauncher);

export default AddItemLauncher;
