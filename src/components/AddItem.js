import React from 'react';



let AddItem = ({ onAddSubmit, onAddCancel }) => {
  let input;

  return (
    <div className="add-item-form">
      <form onSubmit={e => {
        e.preventDefault();
        if (!input.value.trim()) {
          return;
        }
        onAddSubmit(input.value);
        input.value = '';
      }}>
        <input 
          className="add-item-form__input"
          placeholder=" type movie here"
          ref={node => {
            input = node;
          }}
        />
        <div className="add-item-form__footer">
          <button type="submit">
            Add
          </button>
          <button
            type="button" 
            onClick={onAddCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;