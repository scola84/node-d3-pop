const d3 = require('d3-selection');
require('d3-selection-multi');
require('d3-transition');

class Over {
  constructor(container) {
    this.container = container;
    this.build();
  }

  build() {
    this.outer = d3.select(document.createElement('div'))
      .classed('scola over', true)
      .styles({
        'align-items': 'center',
        'background': 'rgba(0, 0, 0, 0.5)',
        'bottom': 0,
        'display': 'flex',
        'justify-content': 'center',
        'left': 0,
        'opacity': 0,
        'position': 'fixed',
        'right': 0,
        'top': 0
      })
      .on('click.scola-pop', this.handleOuterClick.bind(this));

    this.outer
      .transition()
      .style('opacity', 1);

    this.inner = this.outer
      .append('div')
      .classed('scola inner', true)
      .styles({
        'background': '#FFF',
        'height': '100%',
        'overflow': 'hidden',
        'position': 'relative',
        'transform': 'scale(1)',
        'width': '100%'
      })
      .on('click.scola-pop', this.handleInnerClick.bind(this));
  }

  destroy() {
    this.outer
      .transition()
      .style('opacity', 0)
      .on('end', this.handleEnd.bind(this));
  }

  node() {
    return this.outer.node();
  }

  handleOuterClick() {
    this.destroy();
  }

  handleInnerClick() {
    d3.event.stopPropagation();
  }

  handleEnd() {
    this.container.remove(this);
  }
}

module.exports = Over;
