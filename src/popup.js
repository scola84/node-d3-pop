import { event, select } from 'd3';
import Body from './body';

export default class PopUp {
  constructor() {
    this._container = null;

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

    this._bind();
    this.show(true);
  }

  destroy() {
    this._unbind();
    this._deleteBody();

    this._container.append(this, false);
    this._container = null;

    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  container(value = null) {
    if (value === null) {
      return this._container;
    }

    this._container = value;
    this._container.append(this);

    return this;
  }

  lock(value = null) {
    if (value === null) {
      return this._lock;
    }

    this._lock = value;
    return this;
  }

  body(action = null) {
    if (action === false) {
      return this._deleteBody();
    }

    if (this._body === null) {
      this._insertBody();
    }

    return this._body;
  }

  show(value) {
    return this._root
      .transition()
      .style('opacity', Number(value));
  }

  click() {
    if (this._lock === true) {
      return;
    }

    this.close();
  }

  close() {
    this
      .show(false)
      .on('end', () => this.destroy());
  }

  _bind() {
    this._root.on('click.scola-pop', () => this.click());
    this._inner.on('click.scola-pop', () => event.stopPropagation());
  }

  _unbind() {
    this._root.on('click.scola-pop', null);
    this._inner.on('click.scola-pop', null);
  }

  _insertBody() {
    this._body = new Body();
    this._body.direction('row');

    this._inner
      .append(() => this._body.root().node());

    return this;
  }

  _deleteBody() {
    if (this._body) {
      this._body.destroy();
      this._body = null;
    }

    return this;
  }
}
