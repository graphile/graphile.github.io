import React from "react";

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
      <div className="flex">
        <div>
          <ul className="list">
            {examples.map(({ title, examples: subexamples }, i) => (
              <li key={title}>
                {isRootSelected(i) ? "▼" : "▶"}{" "}
                <span
                  onClick={this.select(i)}
                  className={isRootSelected(i) ? "b black" : "b black-60"}
                >
                  {title}
                </span>
                {isRootSelected(i) ? (
                  <ul className="list">
                    {subexamples.map(({ title: subtitle }, j) => (
                      <li key={subtitle}>
                        {isSubSelected(i, j) ? "●" : "○"}{" "}
                        <span
                          onClick={this.select(i, j)}
                          className={
                            isSubSelected(i, j) ? "b black" : "b black-60"
                          }
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
        <div className="flex">
          <div>
            <pre>
              <code>{selectedExample.query}</code>
            </pre>
          </div>
          <div>
            <pre>
              <code>{selectedExample.result}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
