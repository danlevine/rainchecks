import React from 'react';

const Item = ({ onDeleteClick, name, description, poster }) => (
  <li>
    <img src={poster} />
    {name}
    <div>{description}</div>
    <button onClick={onDeleteClick}>X</button>
  </li>
);

export default Item;