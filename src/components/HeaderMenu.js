import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import * as actions from "../actions";

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownExpanded: false
    };

    this.toggleHeaderMenu = this.toggleHeaderMenu.bind(this);
    this.handleUserLogout = this.handleUserLogout.bind(this);
  }

  toggleHeaderMenu() {
    this.setState(prevState => {
      return {
        ...prevState,
        dropdownExpanded: !prevState.dropdownExpanded
      };
    });
  }

  handleUserLogout() {
    this.props.userLogout();
    this.setState({ dropdownExpanded: false });
  }

  render() {
    const { toggleActiveArchivedList } = this.props;
    const showActive = this.props.items.filter === "active";
    const currentUser = this.props.user.currentUser;

    if (currentUser) {
      return (
        <HeaderMenuStyled>
          <button
            className={`header-menu__menu-btn ${
              this.state.dropdownExpanded ? "expanded" : ""
            } `}
            onClick={this.toggleHeaderMenu}
          >
            {!this.state.dropdownExpanded ? (
              <i className="fa fa-bars" />
            ) : (
              <i className="fa fa-close" />
            )}
          </button>
          {this.state.dropdownExpanded ? (
            <div className="header-menu__dropdown-container">
              {currentUser && (
                <div className="header-menu__user-box">
                  Logged in as
                  <br />
                  <span className="header-menu__user-email">
                    {currentUser.email}
                  </span>
                </div>
              )}
              <ul>
                <li>
                  <hr />
                  <button
                    className="header__toggle-list-btn"
                    onClick={toggleActiveArchivedList}
                  >
                    {showActive ? "Watched " : "Unwatched "}
                    {showActive ? (
                      <i className="fa fa-archive" />
                    ) : (
                      <i className="fa fa-ticket" />
                    )}
                  </button>
                </li>
                {currentUser && (
                  <li>
                    <hr />
                    <button
                      className="header__toggle-list-btn"
                      onClick={this.handleUserLogout}
                    >
                      Sign Out <i className="fa fa-sign-out" />
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            ""
          )}
        </HeaderMenuStyled>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = ({ user, items }) => {
  return {
    user,
    items
  };
};

HeaderMenu = connect(
  mapStateToProps,
  actions
)(HeaderMenu);

const HeaderMenuStyled = styled.div`
  button {
    &:focus {
      outline: 1px dashed white;
      outline-offset: -2px;
    }
  }

  .header-menu__menu-btn {
    position: fixed;
    top: 0;
    right: 15px;
    border: none;
    background: #31abe1;
    color: #fff;
    padding: 0;
    height: 40px;
    width: 48px;
    font-size: 26px;
    z-index: 999;
    cursor: pointer;
    border: 4px solid white;
    border-top: none;
    border-bottom: none;

    @media (min-width: 480px) {
      right: 70px;
    }

    &.expanded {
      border-left-color: transparent;
    }
  }

  .header-menu__dropdown-container {
    position: absolute;
    top: 0;
    right: 15px;
    padding-top: 40px;
    background-color: #31abe1;
    border: 4px solid white;
    border-top: none;
    color: #fff;
    border-radius: 0 0px 4px 4px;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);

    @media (min-width: 480px) {
      right: 70px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      hr {
        margin: 0 auto;
        width: 80%;
        border-top-color: #fff;
      }
    }
  }

  .header-menu__user-box {
    padding: 5px 20px;
    color: #ccc;
    font-size: 12px;
    text-align: center;
  }

  .header-menu__user-email {
    color: #fff;
  }

  .header__toggle-list-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    padding: 10px 20px;
    width: 100%;
  }
`;

export default HeaderMenu;
