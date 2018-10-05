import React from "react";
import { connect } from "react-redux";

import * as actions from "../actions";

import AddItemLauncher from "./AddItemLauncher";
import ItemsContainer from "./ItemsContainer";
import Header from "./Header";
import WelcomeSplash from "./WelcomeSplash";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
  }

  componentDidMount() {
    // If user was previously logged in, auto log-in
    this.props.checkForLoggedInUser();
  }

  login() {
    this.props.userLogin();
  }

  render() {
    if (this.props.isFetching || !this.props.user.userStatusChecked) {
      // When either a) checking if user is logged in
      // OR b) logged in, but fetching user items
      return (
        <div className="rainy-busy-indicator">
          <div className="rainy" />
        </div>
      );
    } else if (this.props.user.currentUser) {
      // User successfully logged in and items fetched
      return (
        <div className="container">
          <Header />
          <ItemsContainer />
          <AddItemLauncher />
        </div>
      );
    } else {
      // User not logged in
      return (
        <div className="container">
          <Header />
          <WelcomeSplash login={this.login} />
        </div>
      );
    }
  }
}

const mapStateToProps = ({ user, isFetching }) => {
  return {
    user,
    isFetching
  };
};

App = connect(
  mapStateToProps,
  actions
)(App);

export default App;
