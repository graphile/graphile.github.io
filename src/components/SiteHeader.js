import React from "react";
import Link from "gatsby-link";

export default ({ location }) =>
  <header className="content">
    <nav className="navbar">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon fa fa-bars" /> Menu
        </button>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname.match(/^\/$/)
                ? "active"
                : ""}`}
              to="/"
            >
              <span className="fa fa-home" /> <span className="home">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname.match(
                /^\/graphile-build(\/|$)/
              )
                ? "active"
                : ""}`}
              to="/graphile-build/getting-started/"
            >
              graphile-build
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname.match(
                /^\/graphile-build-pg(\/|$)/
              )
                ? "active"
                : ""}`}
              to="/graphile-build-pg/introduction/"
            >
              graphile-build-pg
            </Link>
          </li>
          <li className="nav-item ml-auto">
            <a
              className="nav-github-link nav-link"
              href="https://github.com/graphile/graphile-build"
            >
              <span className="fa fa-github" />{" "}
              <span className="github">Github</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>;
