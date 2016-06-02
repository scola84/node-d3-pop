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
        'border-left': '1px none #CCC',
        'border-top': '1px solid #CCC',
        'cursor': 'pointer',
        'float': 'left',
        'height': '3em',
        'line-height': '3em',
        'padding': 0,
        'text-align': 'center',
        'width': '100%'
      });
  }

  node() {
    return this.outer.node();
  }
}
