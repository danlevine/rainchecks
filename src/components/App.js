import React from "react";
import { connect } from "react-redux";

import * as actions from "../actions";

import AddItemLauncher from "./AddItemLauncher";
import ItemsContainer from "./ItemsContainer";
import Header from "./Header";
import BusyIndicator from "./BusyIndicator";
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

  componentWillUnmount() {
    this.props.unmountAuth();
  }

  login() {
    this.props.userLogin();
  }

  render() {
    if (this.props.isAppBusy) {
      return (
        <div className="container">
          <BusyIndicator />
        </div>
      );
    }

    if (this.props.user.currentUser) {
      // User successfully logged in and items fetched
      return (
        <div className="container">
          <Header />
          <ItemsContainer />
          <AddItemLauncher />
        </div>
      );
    }

    if (!this.props.user.currentUser) {
      return (
        <div className="container">
          <Header />
          <WelcomeSplash />
        </div>
      );
    }
  }
}

const mapStateToProps = ({ user, isAppBusy }) => {
  return {
    user,
    isAppBusy
  };
};

App = connect(
  mapStateToProps,
  actions
)(App);

export default App;
