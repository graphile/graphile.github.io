import React, { Component } from "react";
import PropTypes from "prop-types";

import "prismjs/themes/prism-solarizedlight.css";
import "./index.scss";
import "./flexgrid.scss";

class TemplateWrapper extends Component {
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
};

export default TemplateWrapper;
