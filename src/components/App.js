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
    if (this.props.user.currentUser) {
      return (
        <div className="container">
          <Header />
          <ItemsContainer />
          <AddItemLauncher />
        </div>
      );
    } else {
      return (
        <div className="container">
          <Header />
          <WelcomeSplash login={this.login} />
        </div>
      );
    }
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user
  };
};

App = connect(
  mapStateToProps,
  actions
)(App);

export default App;
