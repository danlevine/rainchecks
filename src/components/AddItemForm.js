import React from 'react';



let AddItemForm = ({ onAddSubmit, onAddCancel }) => {
  let input;

  return (
    <div className="add-item">
      <form onSubmit={e => {
        e.preventDefault();
        if (!input.value.trim()) {
          return;
        }
        onAddSubmit(input.value);
        input.value = '';
      }}>
        <input ref={node => {
          input = node;
        }} />
        <button type="submit">
          Add Item
        </button>
        <button
          type="button" 
          onClick={onAddCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;