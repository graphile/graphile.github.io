import React from "react";

export default function MarketingTiers({ children }) {
  return (
    <div className="tier-row">
      <div className="tier-item-container">
        {children.flatMap((c, i) =>
          i === 0 ? [c] : [<div className="tier-break" />, c]
        )}
      </div>
    </div>
  );
}

export class Tier extends React.Component {
  render() {
    const { name, price, tagline, href, description, highlight } = this.props;

    return (
      <div className={`tier ${highlight ? "highlight" : ""}`}>
        <h3>{name}</h3>
        <div className="price-line">
          <span style={{ fontSize: "1.5rem" }}>{price}</span>{" "}
          <span style={{ fontSize: "0.8rem" }}>/month</span>
        </div>
        <div className="tc">
          <a className="button--solid" href={href}>
            Join on GitHub Sponsors{" "}
            <span className="fas fa-fw fa-external-link-square-alt" />
          </a>
        </div>
        <h4>{tagline}</h4>
        <div>
          <span>{description}</span>
        </div>
      </div>
    );
  }
}
