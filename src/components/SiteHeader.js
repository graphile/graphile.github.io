import React from "react";
import Link from "gatsby-link";

export default ({ location }) =>
  <header className="content">
    <nav className="navbar">
      <div className="container">
        <input
          className="navbar-toggler"
          type="checkbox"
          id="toggle"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        />
        <div className="nav-controls">
          <div className="navbar-crosses">
            <span className="line line-1"> </span>
            <span className="line line-2"> </span>
            <span className="line line-3"> </span>
          </div>
          <ul className="navbar-nav">
            <li className="navbar-item">
              <Link
                className={`nav-link ${location.pathname.match(/^\/$/)
                  ? "active"
                  : ""}`}
                to="/"
              >
                <span className="fa fa-home" />{" "}
                <span className="home">Home</span>
              </Link>
            </li>
            <li className="navbar-item">
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
            <li className="navbar-item">
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
            <li className="navbar-item ml-auto">
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
      </div>
    </nav>
  </header>;
