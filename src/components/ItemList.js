import _ from 'lodash';
import React, { Component } from 'react';
import Item from './Item';


class ItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moreItemsVisible: false,
    };

    this.showMoreItems = this.showMoreItems.bind(this);
  }

  createItem(item) {
    const { onArchiveClick, onUnarchiveClick, onDeleteClick } = this.props;

    return (
      <Item
        key={item.key}
        {...item}
        onArchiveClick={() => onArchiveClick(item.key)}
        onUnarchiveClick={() => onUnarchiveClick(item.key)}
        onDeleteClick={() => onDeleteClick(item.key)}
      />
    );
  }

  showMoreItems() {
    this.setState({ moreItemsVisible: true });
  }

  render() {
    const { items } = this.props;
    const { moreItemsVisible } = this.state;

    return (
      <ul className="item-list">
        {_.map(items.filteredItems.slice(0, 6), item =>
          this.createItem(item)
        )}

        { !moreItemsVisible &&
          <li>
            <button
              className="item-list__show-more-btn"
              onClick={this.showMoreItems}
            >
              Show More
            </button>
          </li>
        }

        { moreItemsVisible &&
          _.map(items.filteredItems.slice(6, items.filteredItems.length), item =>
            this.createItem(item)
          )
        }
      </ul>
    );
  }
}

export default ItemList;