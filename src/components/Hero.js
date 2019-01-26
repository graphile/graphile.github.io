import React from "react";

export default function Hero({ children, white }) {
  return (
    <header
      className="hero simple"
      style={white ? { backgroundColor: "white" } : {}}
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
