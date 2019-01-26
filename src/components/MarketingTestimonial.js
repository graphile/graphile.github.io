import React from "react";
export default function MarketingTestimonial({
  name,
  role,
  link,
  linkIcon = "fas fa-external-link-alt",
  children,
}) {
  return (
    <article
      className="pa1 black bg-white pa4-ns mv3 mh2 ba b--black-10"
      style={{ flex: "1 0 20rem" }}
    >
      <div className="tc">
        <span className="f3 b">{name}</span>
        <br />
        <span className="i f5 b">{role}</span>{" "}
        <a href={link} rel="noopener noreferrer" target="_blank">
          <span className={`${linkIcon}`} />
        </a>
        <hr className="mw3 bb bw1 b--black-10 db" />
      </div>
      <p className="lh-copy measure center f6 black-70">
        <i
          className="fas fa-quote-left h3 w3 di"
          style={{ color: "#004081" }}
          aria-hidden="true"
        />
        &nbsp;{children}&nbsp;
        <i
          className="fas fa-quote-right h3 w3 di"
          style={{ color: "#004081" }}
          aria-hidden="true"
        />
      </p>
    </article>
  );
}
