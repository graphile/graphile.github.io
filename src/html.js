import React from "react";
import * as PropTypes from "prop-types";
import { TypographyStyle, GoogleFont } from "react-typography";
import Typography from "typography";
import theme from "typography-theme-fairy-gates";
theme.baseFontSize = "20px";
theme.bodyGray = "40";
theme.overrideStyles = () => ({
  a: {
    textShadow: "initial",
    color: "initial",
    backgroundColor: "initial",
  },
});
const typography = new Typography(theme);

const propTypes = {
  headComponents: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  postBodyComponents: PropTypes.node.isRequired,
};

class Html extends React.Component {
  render() {
    return (
      <html lang="en">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NNK4X8M');`,
            }}
          />
          <script src="https://use.fontawesome.com/c72bfae6f9.js" />
          {this.props.headComponents}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0 maximum-scale=5.0"
          />
          <TypographyStyle typography={typography} />
          <GoogleFont typography={typography} />
          <link rel="stylesheet" href="/styles.css" />
        </head>
        <body>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-NNK4X8M"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
}

Html.propTypes = propTypes;

module.exports = Html;
