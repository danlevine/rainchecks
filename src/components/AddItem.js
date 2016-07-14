import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddItemForm from './AddItemForm';
import * as actions from '../actions';


class AddItem extends Component {

  render () {
    const { addItem, isAddFormActive, activateAddItem, cancelAddItem } = this.props;
    if (!isAddFormActive) {
      return (
        <button onClick={activateAddItem} >+</button>
      );
    }

    return (
      <div>
        <AddItemForm 
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

AddItem = connect(
  mapStateToProps,
  actions
)(AddItem);

export default AddItem;