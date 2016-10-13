import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddItem from './AddItem';
import * as actions from '../actions';


class AddItemLauncher extends Component {

  render () {
    const { addItem, isAddFormActive, activateAddItem, cancelAddItem } = this.props;
    if (!isAddFormActive) {
      return (
        <button
          className="btn-open-add-item btn-round"
          onClick={activateAddItem}
        >
          <span>+</span>
        </button>
      );
    }

    return (
      <div>
        <AddItem
          onAddSubmit={addItem}
          onAddCancel={cancelAddItem}
        />
      </div>
    );
  };
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