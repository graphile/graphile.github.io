import React from "react";
import Link from "gatsby-link";

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pv5 bt b--black f6 lh-copy">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-2 nested-list-reset ">
            <h6>PostGraphile</h6>
            <ul>
              <li>
                <Link to="/postgraphile/introduction/">Introduction</Link>
              </li>
              <li>
                <Link to="/postgraphile/security/">Security</Link>
              </li>
              <li>
                <Link to="/postgraphile/extending/">Extending</Link>
              </li>
            </ul>
          </div>
          <div className="col-xs-12 col-md-2 nested-list-reset ">
            <h6>Graphile Build</h6>
            <ul>
              <li>
                <Link to="/graphile-build/">About</Link>
              </li>
              <li>
                <Link to="/graphile-build/getting-started/">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link to="/graphile-build/plugins/">Plugins</Link>
              </li>
            </ul>
          </div>
          <div className="col-xs-12 col-md-4 nested-list-reset">
            <h6>Community</h6>
            <ul>
              <li>
                <a href="https://github.com/graphile">GitHub</a>
              </li>
              <li>
                <a href="https://gitter.im/graphile/postgraphile">
                  Gitter chat
                </a>
              </li>
              <li>
                <a href="https://twitter.com/benjie">Twitter</a>
                {/* TODO: update to Graphile twitter */}
              </li>
            </ul>
          </div>
          <div className="col-xs-12 col-md-4">
            <h6>About</h6>
            PostGraphile and Graphile Build are Open Source Software, maintained
            by <a href="https://twitter.com/benjie">Benjie Gillam</a>.
            <br />
            PostGraphile was <a href="/history/">originally authored</a> as
            PostGraphQL by{" "}
            <a href="https://twitter.com/calebmer">Caleb Meredith</a>.
            <br />
            <br />
            This site is copyright &copy; Benjie Gillam {currentYear}. Design
            and logo copyright &copy; Jof Arnold {currentYear}.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
