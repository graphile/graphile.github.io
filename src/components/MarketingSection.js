import React from "react";
import COLOURS, { TEXT } from "./colours";

export default function MarketingSection({ className = "", children, bg }) {
  return (
    <div
      className={
        className + ` pv3 ma0 marketing-section marketing-section-${bg} tc`
      }
      style={{ backgroundColor: COLOURS[bg], color: TEXT[bg] }}
    >
      <div className="container">{children}</div>
    </div>
  );
}
