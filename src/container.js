import { event, select } from 'd3';

export default class Container {
  constructor() {
    this._elements = new Set();

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
    this._elements.forEach((element) => element.hide());
    this._elements.clear();

    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  append(element, action = true) {
    if (action === false) {
      return this._deleteElement(element);
    }

    return this._insertElement(element);
  }

  _bind() {
    select(window).on('keyup.scola-pop', () => this._keyUp());
  }

  _unbind() {
    select(window).on('keyup.scola-pop', null);
  }

  _keyUp() {
    if (event.keyCode === 27 && this._elements.size > 0) {
      Array.from(this._elements).pop().click();
    }
  }

  _show() {
    if (this._elements.size === 1) {
      this._root.style('display', 'block');
    }
  }

  _hide() {
    if (this._elements.size === 0) {
      this._root.style('display', 'none');
    }
  }

  _insertElement(element) {
    this._elements.add(element);
    this._root.append(() => element.root().node());

    this._show();
    return element;
  }

  _deleteElement(element) {
    this._elements.delete(element);
    element.root().node().remove();

    this._hide();
    return element;
  }
}
