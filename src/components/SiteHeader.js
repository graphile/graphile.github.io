import React from "react";
import Link from "gatsby-link";
import { withRouter } from "react-router-dom";

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
      history.push(path);
    },
  });
}

export default withRouter(
  class SiteHeader extends React.Component {
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
      const navbarItemClassName =
        "navbar-item items-center flex f5 hover-blue link black-70 mr2 mr3-m mr4-l dib";
      const navLink = "nav-link no-underline";
      return (
        <header className="content">
          <nav className="navbar bg-white items-center w-100 f6 pa3 ph5-ns z-9999">
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
                  <li className={navbarItemClassName}>
                    <Link
                      className={`${navLink} ${location.pathname.match(/^\/$/)
                        ? "active"
                        : ""}`}
                      to="/"
                    >
                      <span className="fa fa-home" />{" "}
                      <span className="home">Home</span>
                    </Link>
                  </li>
                  <li className={navbarItemClassName}>
                    <Link
                      className={`${navLink} ${location.pathname.match(
                        /^\/postgraphile(\/|$)/
                      )
                        ? "active"
                        : ""}`}
                      to="/postgraphile/"
                    >
                      PostGraphile
                    </Link>
                  </li>
                  <li className={navbarItemClassName}>
                    <Link
                      className={`${navLink} ${location.pathname.match(
                        /^\/graphile-build(\/|$)/
                      )
                        ? "active"
                        : ""}`}
                      to="/graphile-build/"
                    >
                      Graphile Build
                    </Link>
                  </li>
                  <li className={navbarItemClassName}>
                    <Link
                      className={`${navLink} ${location.pathname.match(
                        /^\/support(\/|$)/
                      )
                        ? "active"
                        : ""}`}
                      to="/support/"
                    >
                      Support
                    </Link>
                  </li>
                  <li className={navbarItemClassName}>
                    <span className="searchbox-container">
                      <input
                        id="search-box"
                        placeholder="Search"
                        ref={this.handleSearchBoxRef}
                      />
                      <span className="fa fa-search searchbox-search" />
                    </span>
                  </li>
                  <li className={navbarItemClassName}>
                    <a
                      className={`nav-github-link ${navLink}`}
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
        </header>
      );
    }
  }
);
