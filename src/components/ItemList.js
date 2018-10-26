import React, { Component } from "react";
import _ from "lodash";
import styled from "styled-components";

import BusyIndicator from "./BusyIndicator";
import Item from "./Item";

class ItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moreItemsVisible: false
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
    const { items, isAddingItem } = this.props;
    const { moreItemsVisible } = this.state;

    if (items.filteredItems.length === 0) {
      return (
        <NoItemsContainerStyled>
          Don't be shy, start your list by adding a movie using the red plus
          button down below!
        </NoItemsContainerStyled>
      );
    }

    return (
      <ul className="item-list">
        {isAddingItem && (
          <PendingItemPlaceholder>
            <BusyIndicator />
          </PendingItemPlaceholder>
        )}

        {_.map(items.filteredItems.slice(0, 6), item => this.createItem(item))}

        {!moreItemsVisible &&
          items.filteredItems.length > 6 && (
            <li>
              <button
                className="item-list__show-more-btn"
                onClick={this.showMoreItems}
              >
                Show More
              </button>
            </li>
          )}

        {moreItemsVisible &&
          _.map(
            items.filteredItems.slice(6, items.filteredItems.length),
            item => this.createItem(item)
          )}
      </ul>
    );
  }
}

const NoItemsContainerStyled = styled.div`
  color: white;
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
  text-align: center;
  font-size: 16px;
`;

const PendingItemPlaceholder = styled.li`
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 6px;
  position: relative;
  min-height: 150px;
  display: flex;
  z-index: 1;
  cursor: pointer;
  padding: 0;
  border: none;
  text-align: left;
  width: 100%;
  animation-duration: 0.4s;
  animation-name: slidein-item;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  div {
    top: 15px;
  }

  @media (min-width: 620px) {
    min-height: 300px;

    div {
      top: 85px;
    }
  }
`;

export default ItemList;
