import React, { Component } from "react";
import PropTypes from "prop-types";

import "prismjs/themes/prism-solarizedlight.css";
import "./flexgrid.scss";
import "./index.scss";

class TemplateWrapper extends Component {
  onKeyDown = e => {
    if (e.target === this.self && e.keyCode === 191) {
      const el = document.getElementById("search-box");
      if (el) {
        el.focus();
        e.preventDefault();
      }
    }
  };
  focus = el => {
    this.self = el;
    if (el) {
      el.focus();
    }
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      setTimeout(() => {
        if (this.self) this.self.focus();
      }, 0);
    }
  }
  render() {
    const { children, ...restOfProps } = this.props;
    return (
      <div onKeyDown={this.onKeyDown} tabIndex="-1" ref={this.focus}>
        {children(restOfProps)}
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
