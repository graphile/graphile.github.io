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
                <a href="https://postgraphile.org/postgraphile/5/">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://postgraphile.org">About</a>
              </li>
              <li>
                <a href="https://postgraphile.org/postgraphile/5/community-plugins">
                  Community Plugins
                </a>
              </li>
              <li>
                <a href="https://postgraphile.org/news">News</a>
              </li>
            </ul>
          </div>
          <div className="col-xs-12 col-md-2 nested-list-reset ">
            <h6>Graphile Engine</h6>
            <ul>
              <li>
                <a href="https://build.graphile.org/graphile-build/5/">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://build.graphile.org/">About</a>
              </li>
              <li>
                <a href="https://build.graphile.org/graphile-build/5/plugins">
                  Plugins
                </a>
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
                <a href="https://fosstodon.org/@graphile" rel="me">
                  <i className="fab fa-mastodon" /> Mastodon
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCPPQNCaD8ukbb5gp1KrYMqA">
                  <i className="fa fa-play" /> Youtube
                </a>
              </li>
              <li>
                <Link to="/news/press-kit/">
                  <i className="fas fa-file-archive" /> Press Kit
                </Link>
              </li>
              <li>
                <a href="https://learn.graphile.org/">
                  <i className="fas fa-graduation-cap" /> Learn
                </a>
              </li>
            </ul>
          </div>
          <div className="col-xs-12 col-md-offset-1 col-md-5">
            <h6>About</h6>
            PostGraphile, Gra<em>fast</em> and all of the Graphile suite of
            tools are crowd-funded Open Source Software, developed and
            maintained primarily by{" "}
            <a href="https://twitter.com/benjie">@Benjie</a> with the help of
            the community.
            <br />
            <br />
            You can support the projects via{" "}
            <Link to="/sponsor/">sponsorship</Link>, by{" "}
            <a href="https://postgraphile.org/pricing">going Pro</a>, or by
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
            </a>
            .
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
