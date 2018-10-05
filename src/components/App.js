import React from "react";
import { connect } from "react-redux";

import * as actions from "../actions";

import AddItemLauncher from "./AddItemLauncher";
import ItemsContainer from "./ItemsContainer";
import Header from "./Header";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // If user was previously logged in, auto log-in
    this.props.checkForLoggedInUser();
  }

  login() {
    this.props.userLogin();
  }

  logout() {
    this.props.userLogout();
  }

  render() {
    console.log("this.props", this.props);
    if (this.props.user.currentUser) {
      console.log("logged in: ", this.props.user.currentUser.email);
      return (
        <div className="container">
          <Header />
          <button onClick={this.logout}>Log Out</button>
          <ItemsContainer />
          <AddItemLauncher />
        </div>
      );
    } else {
      return (
        <div className="container">
          <Header />
          <div>
            <h3>
              Log in with your Google account to add sweet flicks for those
              rainy days!
            </h3>
            <button onClick={this.login}>Log In</button>
          </div>
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
