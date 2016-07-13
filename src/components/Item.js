import React from 'react';

const Item = ({ onDeleteClick, name, description, poster }) => (
  <li className="item">
    <div>
      <h2 className="item__name">{name}</h2>
      <button className="item__btn-delete" onClick={onDeleteClick}>X</button>
      <div>{description}</div>
    </div>
    <div>
      <img className="item__poster" src={poster} />
    </div>
  </li>
);

export default Item;