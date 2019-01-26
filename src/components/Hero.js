import React from "react";
import COLOURS from "./colours";

export default function Hero({ children, bg }) {
  return (
    <header
      className="hero simple"
      style={bg ? { backgroundColor: COLOURS[bg] } : {}}
    >
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="hero-block">{children}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
