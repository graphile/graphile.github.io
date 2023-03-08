import React from "react";
import Link from "gatsby-link";
import { Router, navigate } from "@reach/router";

class SimpleFrag extends React.Component {
  focus() {}
  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}
const Route = ({ exact, path, render }) => {
  const Child = () => render();
  const paths = Array.isArray(path) ? path : [path];
  return (
    <Router component={SimpleFrag}>
      {paths.map(path => (
        <Child key={path} path={exact ? path : path + "/*"} />
      ))}
    </Router>
  );
};

const POSTGRAPHILE_ROUTES = [
  "/postgraphile",
  "/sponsor",
  "/support",
  "/contribute",
];

function enableSearch(history) {
  if (typeof docsearch === "undefined") {
    return;
  }
  docsearch({
    apiKey: "b8bae02e7bf22b05801b361ea00f9bf5",
    indexName: "graphile",
    inputSelector: "#search-box",
    debug: false,
    handleSelected: (input, event, suggestion) => {
      const url = suggestion.url;
      const path = url.replace(/^https?:\/\/[^/]*/, "");
      navigate(path);
    },
  });
}

export default class SiteHeader extends React.Component {
  handleSearchBoxRef = () => {
    document.addEventListener(
      "DOMContentLoaded",
      enableSearch.bind(null, this.props.history)
    );
    document.addEventListener(
      "load",
      enableSearch.bind(null, this.props.history)
    );
    enableSearch(this.props.history);
  };
  render() {
    const { location } = this.props;
    return (
      <header className="header content absolute z-999 w-100">
        <nav className="navbar">
          <div className="container">
            <input
              className="navbar-toggler input-reset"
              type="checkbox"
              id="toggle"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            />
            <div className="nav-controls nested-list-reset ">
              <div className="navbar-crosses">
                <span className="line line-1"> </span>
                <span className="line line-2"> </span>
                <span className="line line-3"> </span>
              </div>
              <ul className="navbar-nav flex w-100">
                <li className="navbar-item">
                  <Link
                    className={`nav-link ${
                      location.pathname.match(/^\/$/) ? "active" : ""
                    }`}
                    to="/"
                  >
                    <span className="home-icon fas fa-home" />{" "}
                    <span className="home">Home</span>
                  </Link>
                </li>

                {/* HOMEPAGE */}

                <Route
                  exact
                  path="/"
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(/^\/sponsor(\/|$)/)
                            ? "active"
                            : ""
                        }`}
                        to="/sponsor/"
                      >
                        Sponsor
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path="/"
                  exact
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(/^\/news\/?$/) ? "active" : ""
                        }`}
                        to="/news/"
                      >
                        News
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path="/"
                  exact
                  render={() => (
                    <li className="navbar-item">
                      <a
                        className="nav-link"
                        href="https://discord.gg/graphile"
                      >
                        Chat{" "}
                        <span className="fas fa-external-link-square-alt" />{" "}
                      </a>
                    </li>
                  )}
                />
                <Route
                  path="/"
                  exact
                  render={() => (
                    <li className="navbar-item">
                      <a
                        className="nav-link"
                        href="https://learn.graphile.org/"
                      >
                        Learn{" "}
                        <span className="fas fa-external-link-square-alt" />{" "}
                      </a>
                    </li>
                  )}
                />

                {/* PostGraphile pages */}

                <Route
                  path={POSTGRAPHILE_ROUTES}
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(/^\/postgraphile\/?$/)
                            ? "active"
                            : ""
                        }`}
                        to="/postgraphile/"
                      >
                        Overview
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path={POSTGRAPHILE_ROUTES}
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(
                            /^\/postgraphile\/.(?!ricing)/
                          )
                            ? "active"
                            : ""
                        }`}
                        to="/postgraphile/introduction/"
                      >
                        Docs
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path={POSTGRAPHILE_ROUTES}
                  render={() => (
                    <li className="navbar-item">
                      <a
                        className="nav-link"
                        href="https://github.com/graphile/postgraphile/releases"
                      >
                        Changelog{" "}
                        <span className="fas fa-external-link-square-alt" />{" "}
                      </a>
                    </li>
                  )}
                />
                <Route
                  path={POSTGRAPHILE_ROUTES}
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(/^\/sponsor(\/|$)/)
                            ? "active"
                            : ""
                        }`}
                        to="/sponsor/"
                      >
                        Sponsor
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path={POSTGRAPHILE_ROUTES}
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(/^\/contribute(\/|$)/)
                            ? "active"
                            : ""
                        }`}
                        to="/contribute/"
                      >
                        Contribute
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path={POSTGRAPHILE_ROUTES}
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`hide-when-small nav-link ${
                          location.pathname.match(
                            /^\/postgraphile\/pricing(\/|$)/
                          )
                            ? "active"
                            : ""
                        }`}
                        to="/postgraphile/pricing/"
                      >
                        Go Pro!
                      </Link>
                    </li>
                  )}
                />

                {/* Graphile-build pages */}

                <Route
                  path="/graphile-build"
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(/^\/graphile-build\/?$/)
                            ? "active"
                            : ""
                        }`}
                        to="/graphile-build/"
                      >
                        Overview
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path="/graphile-build"
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(
                            /^\/graphile-build\/.(?!ricing)/
                          )
                            ? "active"
                            : ""
                        }`}
                        to="/graphile-build/getting-started/"
                      >
                        Documentation
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path="/graphile-build"
                  render={() => (
                    <li className="navbar-item">
                      <Link className={"nav-link"} to="/postgraphile/">
                        PostGraphile
                      </Link>
                    </li>
                  )}
                />
                {/* News pages */}

                <Route
                  path="/news"
                  render={() => (
                    <li className="navbar-item">
                      <Link className={`nav-link`} to="/news/rss.xml">
                        <span aria-hidden="true" className="fa fa-rss-square" />{" "}
                        <span className="rss">RSS</span>
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path="/news"
                  render={() => (
                    <li className="navbar-item">
                      <Link className={`nav-link`} to="/sponsor/">
                        Sponsor
                      </Link>
                    </li>
                  )}
                />
                <Route
                  path="/news"
                  render={() => (
                    <li className="navbar-item">
                      <Link
                        className={`nav-link ${
                          location.pathname.match(/^\/news\/?$/) ? "active" : ""
                        }`}
                        to="/news/"
                      >
                        Latest Announcements
                      </Link>
                    </li>
                  )}
                />
                {/* FIN */}

                <li className="navbar-item ml-auto navbar-item-right">
                  <span className="searchbox-container">
                    <input
                      id="search-box"
                      placeholder="Search"
                      ref={this.handleSearchBoxRef}
                    />
                    <span className="fas fa-search searchbox-search" />
                  </span>
                </li>
                <li className="navbar-item navbar-item-right">
                  <Link
                    className={`nav-link ${
                      location.pathname.match(/^\/support(\/|$)/)
                        ? "active"
                        : ""
                    }`}
                    to="/support/"
                  >
                    <span>
                      <span className="hide-when-small">Professional </span>
                      Support
                    </span>
                  </Link>
                </li>
                {/*
                  <li className="navbar-item navbar-item-right hide-when-small">
                    <a
                      className="nav-link"
                      href="https://graphql-training.com"
                      title="GraphQL Training in London, Europe and Remote"
                    >
                      GraphQL Training{" "}
                      <span className="fas fa-external-link-square-alt" />
                    </a>
                  </li>
                  */}
                <li className="navbar-item navbar-item-right">
                  <a
                    className="nav-link nav-github-link flex items-center"
                    href={
                      location.pathname.match(/^\/postgraphile(\/|$)/)
                        ? "https://github.com/graphile/postgraphile"
                        : location.pathname.match(/^\/graphile-build(\/|$)/)
                        ? "https://github.com/graphile/graphile-engine"
                        : "https://github.com/graphile"
                    }
                  >
                    <span className="f3 fab fa-github" />{" "}
                    <span className="github">
                      Github{" "}
                      <span className="fas fa-external-link-square-alt" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}
