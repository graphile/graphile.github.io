import React from "react";
import fallbackIcon from "../images/avatar.svg";


export default function MarketingContributions({ children }) {
  return (
      <div>
        <div
          className="flex"
          style={{
            justifyContent: "space-around",
            flexWrap: "wrap"
          }}
        >
          {children}
        </div>
      </div>
  );
}

function Icon({ src }) {
  return (
    <img
      style={{ width: "5rem", height: "5rem" }}
      src={src || fallbackIcon}
    />
  );
}

export class Contribution extends React.Component {
  render() {
    const { title, text, icon } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          color: "#1b3955",
          margin: "0.5em",
          padding: "0.5em",
          borderRadius: 0,
          minHeight: "8em",
          justifyContent: "space-evenly",
          flex: "0 0 26em"
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            justifyContent: "space-evenly",
            alignItems: "center",
            fontSize: "1.6em",
          }}
        >
          <Icon src={icon} />
          <span>{title}</span>
        </div>
        <div
          style={{
            flex: "0 0 16em",
          }}  
        >
          <span>{text}</span>
        </div>
      </div>
    );
  }
}
