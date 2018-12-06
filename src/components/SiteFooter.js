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
            <h6>Graphile Engine</h6>
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
          <div className="col-xs-12 col-md-2 nested-list-reset">
            <h6>Resources</h6>
            <ul>
              <li>
                <Link to="/news/">
                  <i className="fas fa-bullhorn" /> News
                </Link>
              </li>
              <li>
                <a href="https://github.com/graphile">
                  <i className="fab fa-github" /> GitHub
                </a>
              </li>
              <li>
                <a href="http://discord.gg/graphile">
                  <i className="fab fa-discord" /> Chat (discord)
                </a>
              </li>
              <li>
                <a href="https://twitter.com/graphilehq">
                  <i className="fab fa-twitter" /> Twitter
                </a>
              </li>
              <li>
                <Link to="/news/press-kit/">
                  <i className="fas fa-file-archive" /> Logos/etc
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-xs-12 col-md-offset-1 col-md-5">
            <h6>About</h6>
            PostGraphile and Graphile Build are crowd-funded Open Source
            Software, developed and maintained primarily by{" "}
            <a href="https://twitter.com/benjie">@Benjie</a> with the help of
            the community.
            <br />
            <br />
            You can support the projects via{" "}
            <a
              href="https://www.patreon.com/benjie"
              target="_blank"
              rel="noopener noreferrer"
            >
              Patreon
            </a>, by <Link to="/postgraphile/pricing/">going Pro</Link>, or by
            paying for <Link to="/support/">Professional Services</Link>. Your
            support is gratefully received 🙏
            <br />
            <br />
            This site is copyright &copy; Benjie Gillam {currentYear}. Design
            and logos copyright &copy; Benjie Gillam and Jof Arnold{" "}
            {currentYear}.
            <br />
            <br />
            Corrections and contributions to this website are gratefully
            received via{" "}
            <a href="https://github.com/graphile/graphile.github.io">
              its GitHub repository
            </a>.
            <br />
            <br />
            PostGraphile was <a href="/history/">originally authored</a> as
            PostGraphQL by{" "}
            <a href="https://twitter.com/calebmer">Caleb Meredith</a>.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
