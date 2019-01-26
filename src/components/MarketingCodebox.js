import React from "react";
import COLOURS, { TEXT } from "./colours";

export default function MarketingCodebox({ children }) {
  return (
    <div
      style={{
        padding: "2em",
        margin: "1em auto",
        backgroundColor: COLOURS.dark,
        color: TEXT.dark,
        maxWidth: "32em",
      }}
    >
      {children}
    </div>
  );
}
