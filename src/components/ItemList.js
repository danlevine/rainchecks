import React from 'react';
import Item from './Item';

const ItemList = ({ items, onDeleteClick }) => {
  return (
    <ul>
      {Object.keys(items).map(key =>
        <Item
          key={key}
          name={items[key]}
          onDeleteClick={() => onDeleteClick(item.id)}
        />
      )}
    </ul>
  );
};

export default ItemList;