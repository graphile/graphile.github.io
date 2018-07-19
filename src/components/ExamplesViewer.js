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
      <div>
        <div className="sections">
          <ul>
            {examples.map(({ title, examples: subexamples }, i) => (
              <li key={title} className={isRootSelected(i) ? "selected" : ""}>
                <span onClick={this.select(i)}>{title}</span>
                {isRootSelected(i) ? (
                  <ul>
                    {subexamples.map(({ title: subtitle }, j) => (
                      <li
                        key={subtitle}
                        className={isSubSelected(i, j) ? "selected" : ""}
                      >
                        <span onClick={this.select(i, j)}>{subtitle}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="content">
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
