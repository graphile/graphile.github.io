import React from "react";

export default function MarketingBullets({ bullets }) {
  const renderBullet = (text, i) => <li key={i}>{text}</li>;
  const half = Math.floor(bullets.length / 2);
  return (
    <div className="tl container">
      <div className="row">
        <div className="col-xs-12 col-md-6">
          <ul className="ul-check">
            {bullets.slice(0, half).map(renderBullet)}
          </ul>
        </div>
        <div className="col-xs-12 col-md-6">
          <ul className="ul-check">{bullets.slice(half).map(renderBullet)}</ul>
        </div>
      </div>
    </div>
  );
}
