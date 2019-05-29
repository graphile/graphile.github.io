import React, { Component } from "react";
import Link from "gatsby-link";
import GitHubButton from "react-github-btn";

function Tag({ tag }) {
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: "white",
        color: "rgb(27, 57, 86)",
        padding: "0.05em 0.3em",
        margin: "0 0.5em",
        fontSize: "0.5em",
        borderRadius: "0.3em",
        verticalAlign: "middle",
        textTransform: "uppercase",
      }}
    >
      {tag}
    </span>
  );
}

export default class MarketingProduct extends Component {
  render() {
    const { name, headline, children, docs, github, more, big } = this.props;
    const TitleComponent = big ? "h2" : "h3";
    const tag = this.props.tag ? <Tag tag={this.props.tag} /> : null;
    return (
      <div className="">
        <TitleComponent>
          {name}
          {tag}
        </TitleComponent>
        <h4>{headline}</h4>
        <div className="mw6 center">
          <p>{children}</p>
        </div>
        <div className="df flex-row justify-center" style={{ height: "3rem" }}>
          {docs ? (
            <div className="ph2 df flex-column justify-center">
              <a className="button--solid" href={docs}>
                <span className="fas fa-book-open" /> Documentation
              </a>{" "}
            </div>
          ) : null}
          {more ? (
            <div className="ph2 df flex-column justify-center">
              {more[0] === "/" ? (
                <Link className="button--solid" to={more}>
                  <span className="fas fa-arrow-right" /> Learn more
                </Link>
              ) : (
                <a className="button--solid" href={more}>
                  <span className="fas fa-arrow-right" /> Learn more
                </a>
              )}
            </div>
          ) : null}{" "}
          {github ? (
            <div className="ph2 df flex-column justify-center">
              <GitHubButton
                href={github}
                data-size="large"
                data-show-count="true"
                aria-label={`Star ${github.replace(
                  /^https?:\/\/github.com\//,
                  ""
                )} on GitHub`}
              >
                Star
              </GitHubButton>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
