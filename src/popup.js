import { event, select } from 'd3-selection';
import Body from './body';
import 'd3-selection-multi';
import 'd3-transition';
import '@scola/d3-media';

export default class PopUp {
  constructor(container) {
    this._container = container;

    this._lock = false;
    this._body = null;

    this._root = select('body')
      .append('div')
      .remove()
      .classed('scola popup', true)
      .styles({
        'align-items': 'center',
        'background': 'rgba(0, 0, 0, 0.5)',
        'bottom': '0px',
        'display': 'flex',
        'justify-content': 'center',
        'left': '0px',
        'opacity': 0,
        'position': 'fixed',
        'right': '0px',
        'top': '0px'
      });

    this._inner = this._root
      .append('div')
      .classed('scola inner', true)
      .styles({
        'background': '#FFF',
        'border-radius': '1em',
        'overflow': 'hidden',
        'width': '17em'
      });

    this._root
      .transition()
      .style('opacity', 1);

    this._container.append(this, true);
    this._bind();
  }

  destroy(click) {
    if (click === true && this._lock === true) {
      return;
    }

    this._unbind();

    this._root
      .transition()
      .style('opacity', 0)
      .on('end', () => {
        if (this._body) {
          this._body.destroy();
          this._body = null;
        }

        this._container.append(this, false);
        this._container = null;

        this._root.dispatch('destroy');
        this._root.remove();
        this._root = null;
      });
  }

  root() {
    return this._root;
  }

  lock(value) {
    this._lock = value;
    return this;
  }

  body(action) {
    if (typeof action === 'undefined') {
      return this._body;
    }

    if (action === false) {
      this._body.destroy();
      this._body = null;

      return this;
    }

    this._body = new Body();
    this._body.direction('row');

    this._inner.node().appendChild(this._body.root().node());

    return this;
  }

  _bind() {
    this._root.on('click.scola-pop-up', () => this.destroy(true));
    this._inner.on('click.scola-pop-up', () => event.stopPropagation());
  }

  _unbind() {
    this._root.on('click.scola-pop-up', null);
    this._inner.on('click.scola-pop-up', null);
  }
}
