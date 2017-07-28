import React from "react";
import PropTypes from "prop-types";
import Marketing from "./marketing";
import Page from "./page";

import "prismjs/themes/prism-solarizedlight.css";

import "./index.css";

const TemplateWrapper = props => {
  const { location: { pathname } } = props;
  // XXX: Hack Gatsby because it doesn't actually support `layout` yet, bizarrely
  if (pathname === "/") {
    return <Marketing {...props} />;
  } else {
    return <Page {...props} />;
  }
};

TemplateWrapper.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

export default TemplateWrapper;
