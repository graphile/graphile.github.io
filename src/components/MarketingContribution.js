import React from "react";
import fallbackIcon from "../images/avatar.svg";
import { black } from "ansi-colors";

function Icon({ src }) {
  return (
    <img style={{ width: "5rem", height: "5rem" }} src={src || fallbackIcon} />
  );
}

export default function Contribution({ title, children, text, icon }) {
  return (
    <div
      className={`marketing-contribution`}
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        color: "#1b3955",
        margin: "1em",
        padding: "1em",
        borderRadius: 0,
        minHeight: "8em",
        justifyContent: "center",
        flex: "0 0 32em",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          justifyContent: "flex-start",
          alignItems: "center",
          fontSize: "1.6em",
          flex: "0 0 5em",
          marginTop: "1rem",
        }}
      >
        <Icon src={icon} />
        <span>{title}</span>
      </div>
      <div style={{}}>{text || children}</div>
    </div>
  );
}
