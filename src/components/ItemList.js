import _ from 'lodash';
import React from 'react';
import Item from './Item';



const ItemList = ({ items, onArchiveClick, onUnarchiveClick, onDeleteClick }) => {
  return (
    <ul className="item-list">
      {_.map(items.filteredItems, (item) =>
        <Item 
          key={item.key}
          {...item}
          onArchiveClick={() => onArchiveClick(item.key)}
          onUnarchiveClick={() => onUnarchiveClick(item.key)}
          onDeleteClick={() => onDeleteClick(item.key)}
        />
      )}
    </ul>
  );
};

export default ItemList;