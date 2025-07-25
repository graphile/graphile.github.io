import React from "react";

export default function MarketingTiers({ children }) {
  return (
    <div
      className="tier-row"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "stretch",
      }}
    >
      {children}
    </div>
  );
}

export class Tier extends React.Component {
  render() {
    const { name, price, tagline, href, description } = this.props;

    return (
      <div
        className="tier"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "space-between",
          alignContent: "flex-start",
          backgroundColor: "white",
          margin: "0.5em",
          padding: "1rem",
          borderRadius: "12px",
          border: "4px solid #1b1b3d",
          color: "#1b3955",
          flex: "0 0 33%",
        }}
      >
        <h3>{name}</h3>
        <span>
          <span style={{ fontSize: "1.5rem" }}>{price}</span>{" "}
          <span style={{ fontSize: "0.8rem" }}>/month</span>
        </span>
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
