import _ from 'lodash';
import React from 'react';
import Item from './Item';



const ItemList = ({ items, onDeleteClick }) => {
  return (
    <ul className="item-list">
      {_.map(items, (item) =>
        <Item 
          key={item.key}
          {...item}
          onDeleteClick={() => onDeleteClick(item.key)}
        />
      )}
    </ul>
  );
};

export default ItemList;