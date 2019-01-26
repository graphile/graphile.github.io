import React from "react";
import COLOURS, { TEXT } from "./colours";

export default function MarketingCodebox({ children }) {
  return (
    <div
      className="marketing-codebox"
      style={{
        backgroundColor: COLOURS.dark,
        color: TEXT.dark,
      }}
    >
      {children}
    </div>
  );
}
