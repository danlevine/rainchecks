import React from "react";
import HeaderMenu from "../components/HeaderMenu";

const Header = () => (
  <header>
    <div className="header__logo-container">
      <h1>
        rain
        <br />
        checks
      </h1>
    </div>
    <HeaderMenu />
  </header>
);

export default Header;
