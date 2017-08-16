import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import "prismjs/themes/prism-solarizedlight.css";
import "./index.scss";
import "./flexgrid.scss";

let initialised = false;

function init(history) {
  if (typeof docsearch === "undefined") {
    return;
  }
  if (!initialised) {
    initialised = true;

    docsearch({
      apiKey: "b8bae02e7bf22b05801b361ea00f9bf5",
      indexName: "graphile",
      inputSelector: "#search-box",
      debug: false,
      handleSelected: (input, event, suggestion) => {
        const url = suggestion.url;
        const path = url.replace(/^https?:\/\/[^/]*/, "");
        history.push(path);
      },
    });
  }
}

class TemplateWrapper extends Component {
  componentDidMount() {
    document.addEventListener(
      "DOMContentLoaded",
      init.bind(null, this.props.history)
    );
    document.addEventListener("load", init.bind(null, this.props.history));
    init(this.props.history);
  }
  render() {
    const { children, ...restOfProps } = this.props;
    return (
      <div>
        {children(restOfProps)}
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
  history: PropTypes.object.isRequired,
};

export default withRouter(TemplateWrapper);
