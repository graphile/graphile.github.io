import React, { Component } from "react";
import PropTypes from "prop-types";

import "prismjs";
import "prismjs/themes/prism-solarizedlight.css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-graphql";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-sql";
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
  render() {
    const { children } = this.props;
    return (
      <div onKeyDown={this.onKeyDown} tabIndex="-1" ref={this.focus}>
        {/*
        <section className="banner-announcement">
          <Link to="/news/postgraphile-version-4/">
            ANNOUNCEMENT: PostGraphile v4 is released, <u>read more »</u>
          </Link>
        </section>
        */}
        {children}
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
