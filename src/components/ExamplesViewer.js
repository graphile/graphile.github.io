import React from "react";
import PrismCode from "react-prism";

export default class ExamplesViewer extends React.Component {
  state = {
    selected: null,
    subSelected: null,
  };
  select = (i, j) => e => {
    this.setState({ selected: i, subSelected: j || 0 });
  };
  render() {
    const { examples: { edges } } = this.props;
    const examples = edges.map(({ node }) => node);
    const isRootSelected = i => (this.state.selected || 0) === i;
    const isSubSelected = (i, j) =>
      isRootSelected(i) && (this.state.subSelected || 0) === j;
    const selectedExample =
      examples[this.state.selected || 0].examples[this.state.subSelected || 0];
    return (
      <div className="flex bg-black h6 w-100">
        <div className="w-25 bg-white-20 h-100 pa0 ma0 white w5">
          <ul className="list h-100 ma0 pa2">
            {examples.map(({ title, examples: subexamples }, i) => (
              <li key={title} className="ma0 pa0 f6">
                {isRootSelected(i) ? "▾" : "▸"}{" "}
                <span
                  onClick={this.select(i)}
                  className={isRootSelected(i) ? "white" : "white-60"}
                >
                  {title}
                </span>
                {isRootSelected(i) ? (
                  <ul className="list">
                    {subexamples.map(({ title: subtitle }, j) => (
                      <li key={subtitle} className="f6">
                        {/*isSubSelected(i, j) ? "●" : "○"}{" "*/}
                        <span
                          onClick={this.select(i, j)}
                          className={isSubSelected(i, j) ? "white" : "white-60"}
                        >
                          {subtitle}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-75 flex flex-column flex-row-l">
          <div className="w-100 w-50-l h-50 h-100-l flex-auto">
            <PrismCode
              component="pre"
              className="f7 pa1 bl bt br bn-l bt-l bb-l br0 b--black h-100 overflow-auto language-graphql"
            >
              {selectedExample.query}
            </PrismCode>
          </div>
          <div className="w-100 w-50-l h-50 h-100-l flex-auto overflow-auto">
            <PrismCode
              component="pre"
              className="f7 pa1 ba br0 b--black h-100 flex-auto language-json"
            >
              {selectedExample.result}
            </PrismCode>
          </div>
        </div>
      </div>
    );
  }
}
