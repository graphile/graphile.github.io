import React from "react";

export function Flex({ children }) {
  return (
    <div className="container">
      <div className="row flex-wrap">{children}</div>
    </div>
  );
}

export function Col({ className = "", span = 1, offset, children }) {
  return (
    <div
      className={
        className +
        ` col-xs-12 col-md-${span}` +
        (offset ? ` col-md-offset-${offset}` : "")
      }
    >
      {children}
    </div>
  );
}
