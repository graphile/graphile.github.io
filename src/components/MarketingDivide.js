import React from "react";
import COLOURS from "./colours";

export default function MarketingDivide({ from, to, via, down }) {
  const invert = to === "nodes";
  const startX = down ^ invert ? 0 : 1000;
  const endX = down ^ invert ? 1000 : 0;
  const startY = invert ? 200 : 0;
  const endY = invert ? 0 : 200;
  const transparentBg = to === "nodes" || from === "nodes";
  const otherColor = invert ? from : to;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height={via ? "64" : "32"}
      viewBox="0 1 1000 199"
      preserveAspectRatio="none"
      style={{ display: "block" }}
      className="MarketingDivide"
    >
      {transparentBg ? null : (
        <path
          d="M0,0 L1000,0 L1000,200 L0,200 Z"
          fill={COLOURS[from]}
          strokeLinejoin="miter"
        />
      )}
      <path
        d={`M${endX},${endY} L${endX},${
          endY > 0 ? endY * 0.95 : startY * 0.05
        } L${startX},${startY} L${startX},${endY} Z`}
        fill={COLOURS[via || otherColor]}
        strokeLinejoin="miter"
      />
      {via ? (
        <path
          d={`M${endX},${endY} L${startX},${(endY || startY) /
            2} L${startX},${endY} Z`}
          fill={COLOURS[otherColor]}
          strokeLinejoin="miter"
        />
      ) : null}
    </svg>
  );
}
