const d3 = require('d3-selection');
require('d3-selection-multi');

class Button {
  constructor() {
    this.build();
  }

  build() {
    this.outer = d3.select(document.createElement('div'))
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

module.exports = Button;
