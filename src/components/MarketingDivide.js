import React from "react";
import COLOURS from "./colours";

export default function MarketingDivide({ from, to, via, down }) {
  const startX = down ? 0 : 1000;
  const endX = down ? 1000 : 0;
  const startY = 0;
  const endY = 200;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height={via ? "64" : "32"}
      viewBox="0 0 1000 200"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path
        d="M0,0 L1000,0 L1000,200 L0,200 Z"
        fill={COLOURS[from]}
        strokeLinejoin="miter"
      />
      <path
        d={`M${endX},${endY} L${endX},${
          endY > 0 ? endY * 0.95 : startY * 0.05
        } L${startX},${startY} L${startX},${endY} Z`}
        fill={COLOURS[via || to]}
        strokeLinejoin="miter"
      />
      {via ? (
        <path
          d={`M${endX},${endY} L${startX},${(endY || startY) /
            2} L${startX},${endY} Z`}
          fill={COLOURS[to]}
          strokeLinejoin="miter"
        />
      ) : null}
    </svg>
  );
}
