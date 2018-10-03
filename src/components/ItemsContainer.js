import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase";

import * as actions from "../actions";
import ItemList from "../components/ItemList";

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class ItemsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      user: null
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // If user was previously logged in, auto log-in
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });

    this.props.initializeItemsList();
  }

  login() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  render() {
    const {
      archiveItem,
      unarchiveItem,
      deleteItem,
      items,
      isFetching
    } = this.props;

    if (this.state.user) {
      // logged in
      return (
        <div>
          <button onClick={this.logout}>Log Out</button>
          {isFetching ? (
            <div className="spinner spinner-dark">
              <span className="spinner__text">Loading...</span>
            </div>
          ) : (
            <ItemList
              items={items}
              onArchiveClick={archiveItem}
              onUnarchiveClick={unarchiveItem}
              onDeleteClick={deleteItem}
            />
          )}
        </div>
      );
    } else {
      // NOT logged in
      return (
        <div>
          <h3>
            Log in with your Google account to add sweet flicks for those rainy
            days!
          </h3>
          <button onClick={this.login}>Log In</button>
        </div>
      );
    }
  }
}

const mapStateToProps = ({ items, isFetching }) => {
  return {
    items,
    isFetching
  };
};

ItemsContainer = connect(
  mapStateToProps,
  actions
)(ItemsContainer);

export default ItemsContainer;
