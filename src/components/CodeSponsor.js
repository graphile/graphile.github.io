import React from "react";

const token = "r1beBERkvMtxu_7Bp-Wo_A";

class CodeSponsor extends React.Component {
  state = {
    codesponsor: {},
    error: false,
  };
  componentDidMount() {
    this.loadCodeSponsor();
  }
  loadCodeSponsor() {
    if (typeof window.fetch === "function") {
      window
        .fetch("https://app.codesponsor.io/p/" + token + "/message.json", {
          method: "GET",
        })
        .then(response => {
          if (!response.ok) throw new Error("Failed to load");
          return response.json();
        })
        .then(
          json => this.setState({ codesponsor: json }),
          error => this.setState({ error, codesponsor: {} })
        );
    } else {
      // I can't be bothered to emulate XMLHttpRequest
    }
  }
  render() {
    const { link_href, title, body, pixel_href } = this.state.codesponsor;
    return (
      <div className="cs__wrapper">
        <div className="cs__header">Proudly sponsored by</div>
        <a
          href={link_href || "https://codesponsor.io"}
          className="cs__blurb"
          target="_blank"
          rel="noopener"
        >
          <strong>{title || "CodeSponsor.io"}</strong>{" "}
          <span>
            {body || " - get paid by adding one line of code to your README"}
          </span>
        </a>
        <div className="cs__footer">
          powered by{" "}
          <a
            href={`https://codesponsor.io/?utm_source=widget&utm_medium=banner&utm_campaign=${token}`}
            target="_blank"
            rel="noopener"
          >
            codesponsor.io
          </a>
        </div>
        <img className="cs__pixel" src={pixel_href} />
      </div>
    );
  }
}

export default CodeSponsor;
