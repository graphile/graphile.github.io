import React from "react";
import COLOURS, { TEXT } from "./colours";

export default function MarketingSection({
  className = "",
  children,
  bg,
  left,
  maxWidth,
}) {
  return (
    <div
      className={
        className +
        ` pv3 ma0 marketing-section marketing-section-${bg} ${
          left ? "tl" : "tc"
        }`
      }
      style={{ backgroundColor: COLOURS[bg], color: TEXT[bg] }}
    >
      <div className="container" style={maxWidth ? { maxWidth: "48rem" } : {}}>
        {children}
      </div>
    </div>
  );
}
