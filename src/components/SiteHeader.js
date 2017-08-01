import React from "react";
import Link from "gatsby-link";

export default ({ location }) =>
  <header>
    <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
      <button
        className="navbar-toggler navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <Link to="/" className="navbar-brand">
        Graphile
      </Link>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname.match(/^\/$/)
                ? "active"
                : ""}`}
              to="/"
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname.match(/^\/graphile-build(\/|$)/)
                ? "active"
                : ""}`}
              to="/graphile-build/getting-started/"
            >
              Graphile-Build
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  </header>;
