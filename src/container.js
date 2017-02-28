import {
  event,
  select,
  selectAll
} from 'd3';

export default class Container {
  constructor() {
    this._children = new Set();

    this._root = select('body')
      .append('div')
      .classed('scola pop', true)
      .styles({
        'display': 'none',
        'bottom': '0px',
        'left': '0px',
        'position': 'fixed',
        'right': '0px',
        'top': '0px',
        'z-index': 1000
      });

    this._bind();
  }

  destroy() {
    this._unbind();
    this._children.forEach((child) => child.hide());
    this._children.clear();

    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  append(child, action = true) {
    if (action === false) {
      return this._deleteChild(child);
    }

    return this._insertChild(child);
  }

  _bind() {
    select(window).on('keyup.scola-pop', () => this._keyUp());
  }

  _unbind() {
    select(window).on('keyup.scola-pop', null);
  }

  _keyUp() {
    if (event.keyCode === 27 && this._children.size > 0) {
      Array.from(this._children).pop().click();
    }
  }

  _show() {
    if (this._children.size !== 1) {
      return;
    }

    this._root.style('display', 'block');

    selectAll('.scola.app button, .scola.app input')
      .attr('disabled', 'disabled');
  }

  _hide() {
    if (this._children.size !== 0) {
      return;
    }

    this._root.style('display', 'none');

    selectAll('.scola.app button, .scola.app input')
      .attr('disabled', null);
  }

  _insertChild(child) {
    this._children.add(child);
    this._root.append(() => child.root().node());

    this._show();
    return child;
  }

  _deleteChild(child) {
    this._children.delete(child);
    child.root().node().remove();

    this._hide();
    return child;
  }
}
