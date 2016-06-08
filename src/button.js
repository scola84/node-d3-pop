import { select } from 'd3-selection';

export default class Button {
  constructor() {
    this.build();
  }

  build() {
    this.outer = select(document.createElement('div'))
      .classed('scola button', true)
      .styles({
        'background': '#FFF',
        'border': 0,
        'border-left': '1px solid #CCC',
        'border-top': '1px solid #CCC',
        'cursor': 'pointer',
        'height': '3em',
        'line-height': '3em',
        'padding': 0,
        'text-align': 'center'
      });
  }

  node() {
    return this.outer.node();
  }

  top() {
    this.outer.style('border-top-color', '#FFF');
    return this;
  }

  left() {
    this.outer.style('border-left-style', 'none');
    return this;
  }
}
