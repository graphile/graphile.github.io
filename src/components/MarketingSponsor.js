import React from "react";
import { upperFirst } from "lodash";
import fallbackAvatar from "../images/avatar.svg";
import { normalize } from "upath";

const LevelContext = React.createContext(null);

export default function MarketingSponsors({ level, children }) {
  return (
    <LevelContext.Provider value={level}>
      <div>
        <div
          className="flex"
          style={{
            justifyItems: "stretch",
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "wrap",

            fontSize:
              level === "featured"
                ? "1.85rem"
                : level === "leaders"
                ? "1.25rem"
                : "1rem",
          }}
        >
          {children}
        </div>
      </div>
    </LevelContext.Provider>
  );
}

function Avatar({ src, style }) {
  return (
    <img
      style={{ borderRadius: "10rem", width: "5rem", height: "5rem", ...style }}
      src={src || fallbackAvatar}
    />
  );
}

export class Sponsor extends React.Component {
  static contextType = LevelContext;
  render() {
    const { name, contributor, avatar, plain, href } = this.props;
    const level = this.context;
    const showAvatar = level === "featured" || level === "leaders";
    const Component = href ? "a" : "div";
    return (
      <Component
        href={href}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          justifyContent: "space-evenly",
          alignItems: "center",

          flex: `0 0 ${showAvatar ? "14em" : "12em"}`,
          backgroundColor: plain ? null : "white",
          color: plain ? "white" : "#1b3955",
          margin: "0.5em",
          borderRadius: "4px",
          minHeight: showAvatar ? "8em" : "3em",
          fontWeight: "normal",
        }}
      >
        {showAvatar ? (
          <Avatar
            src={avatar}
            style={{
              width: "4em",
              height: "4em",
            }}
          />
        ) : null}
        <span>{name}</span>
      </Component>
    );
  }
}
