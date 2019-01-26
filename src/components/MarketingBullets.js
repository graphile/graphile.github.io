import React from "react";
import remark from "remark";
import remark2react from "remark-react";

function Markdown({ children }) {
  return remark()
    .use(remark2react)
    .processSync(children).contents;
}

export default function MarketingBullets({ bullets }) {
  const renderBullet = (bullet, i) => {
    const [text, sub] = Array.isArray(bullet) ? bullet : [bullet];
    return (
      <li key={i}>
        <strong>{text}</strong>
        {sub ? (
          <>
            <br />
            <Markdown>{sub}</Markdown>
            <div className="mb3" />
          </>
        ) : null}
      </li>
    );
  };
  const half = Math.ceil(bullets.length / 2);
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
