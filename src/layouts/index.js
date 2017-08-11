import React from "react";
import PropTypes from "prop-types";

import "prismjs/themes/prism-solarizedlight.css";
import "./index.scss";
import "./flexgrid.scss";

const TemplateWrapper = props => {
  const { children, ...restOfProps } = props;
  return (
    <div>
      {children(restOfProps)}
    </div>
  );
};

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
