import React from 'react';

const Item = ({ onDeleteClick, name }) => (
  <li>
    {name}
    <button onClick={onDeleteClick}>X</button>
  </li>
);

export default Item;