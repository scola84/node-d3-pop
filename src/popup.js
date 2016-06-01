import { select, event } from 'd3-selection';
import 'd3-selection-multi';
import 'd3-transition';

export default class PopUp {
  constructor(container) {
    this.container = container;
    this.build();
  }

  build() {
    this.outer = select(document.createElement('div'))
      .classed('scola popup', true)
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
        'border-radius': '1em',
        'height': 'auto',
        'overflow': 'hidden',
        'width': '17em'
      })
      .on('click.scola-pop', this.handleInnerClick.bind(this));

    this.body = this.inner
      .append('div')
      .classed('scola body', true)
      .styles({
        'float': 'left',
        'padding': '1em',
        'text-align': 'center',
        'width': '100%'
      });

    this.title = this.body
      .append('div')
      .classed('scola title', true)
      .styles({
        'float': 'left',
        'font-size': '1.2em',
        'font-weight': 'bold',
        'padding': '0 0 0.5em',
        'width': '100%'
      });

    this.text = this.body
      .append('div')
      .classed('scola text', true)
      .styles({
        'float': 'left',
        'line-height': '1.5em',
        'width': '100%'
      });

    this.buttons = this.inner
      .append('div')
      .classed('scola buttons', true)
      .styles({
        'display': 'flex',
        'float': 'left',
        'width': '100%'
      });

    this.container.append(this);
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
    event.stopPropagation();
  }

  handleEnd() {
    this.container.remove(this);
  }
}
