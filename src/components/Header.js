import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import ItemList from '../components/ItemList';

class Header extends Component {
  constructor() {
    super();
  }

  render() {
    const { showActiveList, showArchivedList } = this.props;
    return (
      <header>
        {this.props.items.filter === 'active' ?
          <button className="header__show-archived-list-btn" onClick={showArchivedList}><i className="fa fa-archive"></i></button> :
          <button className="header__show-active-list-btn" onClick={showActiveList}><i className="fa fa-ticket"></i></button>}
        <div className="header__logo-container" />
      </header>
    )
  }
}

const mapStateToProps = ({items}) => {
  return {
    items
  };
};

Header = connect(
  mapStateToProps,
  actions
)(Header);

export default Header;
