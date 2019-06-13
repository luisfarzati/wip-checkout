import React from "react";
import { Route } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import CheckoutDialog from "./CheckoutDialog";

function Application() {
  return (
    <Router>
      <nav className="uk-navbar-container" data-uk-navbar>
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            <li className="uk-active">Active</li>
          </ul>
        </div>
      </nav>
      <div style={{ marginTop: 50 }}>
        <Route exact path="/" render={() => <p>Nothing to see here</p>} />
        <Route exact path="/dialog" component={CheckoutDialog} />
      </div>
    </Router>
  );
}

export default Application;
