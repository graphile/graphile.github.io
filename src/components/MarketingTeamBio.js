import React from "react";
export default function MarketingTeamBio({
  name,
  role,
  children,
  imageAlt,
  imageSrc,
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
        <hr className="mw3 bb bw1 b--black-10 db" />
      </div>
      <p className="lh-copy measure center f6 black-70">
        &nbsp;{children}&nbsp;
      </p>
      <img alt={imageAlt} src={imageSrc} width="800" />
    </article>
  );
}
