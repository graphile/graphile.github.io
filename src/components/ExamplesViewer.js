import React from "react";
import PrismCode from "react-prism";

const slugify = str => str.replace(/[^A-Za-z0-9-.]+/g, "_");

export default class ExamplesViewer extends React.Component {
  constructor(props) {
    super(props);

    let selected = null;
    let subSelected = null;
    if (typeof window !== "undefined" && window.location) {
      if (window.location.hash) {
        const hash = window.location.hash.replace(/^#+/, "");
        const parts = hash.split("__");
        if (parts.length >= 2) {
          const { examples } = props;
          const selectedExampleIdx = examples.findIndex(
            e => slugify(e.title) === parts[0]
          );
          if (selectedExampleIdx >= 0) {
            const selectedSubexampleIdx = examples[
              selectedExampleIdx
            ].examples.findIndex(e => slugify(e.title) === parts[1]);
            selected = selectedExampleIdx;
            subSelected =
              selectedSubexampleIdx >= 0 ? selectedSubexampleIdx : 0;
          }
        }
      }
    }
    this.state = {
      selected,
      subSelected,
    };
  }

  select = (i, j) => e => {
    const { examples } = this.props;
    const selectedTitle = examples[i || 0] ? examples[i || 0].title : null;
    const selectedSubtitle =
      examples[i] && examples[i].examples[j || 0]
        ? examples[i].examples[j || 0].title
        : null;

    if (selectedTitle && selectedSubtitle && typeof window !== "undefined") {
      window.location.hash = `${slugify(selectedTitle)}__${slugify(
        selectedSubtitle
      )}`;
    }

    this.setState({ selected: i, subSelected: j || 0 });
  };
  render() {
    const { examples } = this.props;
    const isRootSelected = i => (this.state.selected || 0) === i;
    const isSubSelected = (i, j) =>
      isRootSelected(i) && (this.state.subSelected || 0) === j;
    const selectedCategory = examples[this.state.selected || 0];
    const selectedExample =
      (selectedCategory &&
        selectedCategory.examples[this.state.subSelected || 0]) ||
      {};
    return (
      <div className="flex bg-black h6 w-100">
        <div className="w-25 bg-white-20 h-100 pa0 ma0 white w5">
          <ul className="list h-100 ma0 pa1 pa2-ns">
            {examples.map(({ title, examples: subexamples }, i) => (
              <li key={title} className="ma0 pa0">
                <span
                  onClick={this.select(i)}
                  className={
                    "f7 f6-ns pointer " +
                    (isRootSelected(i) ? "white" : "white-60")
                  }
                >
                  {isRootSelected(i) ? "▾" : "▸"} {title}
                </span>
                {isRootSelected(i) ? (
                  <ul className="list pl2 pl3-ns">
                    {subexamples.map(({ title: subtitle }, j) => (
                      <li key={subtitle} className="f6 pl1-ns">
                        <span
                          onClick={this.select(i, j)}
                          className={
                            "f7 f6-ns pointer " +
                            (isSubSelected(i, j) ? "white" : "white-60")
                          }
                        >
                          {/*isSubSelected(i, j) ? "●" : "○"}{" "*/}
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
              className={`no-shadow f7 pa1 bl bt br bn-l bt-l bb-l br0 b--silver h-100 overflow-auto language-${
                selectedExample.exampleLanguage
              }`}
            >
              {selectedExample.example}
            </PrismCode>
          </div>
          <div className="w-100 w-50-l h-50 h-100-l flex-auto overflow-auto">
            <PrismCode
              component="pre"
              className={`no-shadow f7 pa1 ba br0 b--silver h-100 flex-auto language-${
                selectedExample.resultLanguage
              }`}
            >
              {selectedExample.result}
            </PrismCode>
          </div>
        </div>
      </div>
    );
  }
}
