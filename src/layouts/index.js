import React from "react";
import PropTypes from "prop-types";

import "prismjs/themes/prism-solarizedlight.css";

const TemplateWrapper = ({ children }) =>
  <div>
    {children()}
  </div>;

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
