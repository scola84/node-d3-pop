import { select } from 'd3-selection';

export default class PopButton {
  constructor() {
    this._direction = null;
    this._first = false;

    this._root = select('body')
      .append('button')
      .remove()
      .classed('scola button', true)
      .styles({
        'background': '#FFF',
        'border': 0,
        'border-top': '1px solid #CCC',
        'cursor': 'pointer',
        'display': 'flex',
        'flex': 1,
        'height': '3em',
        'line-height': '3em',
        'padding': 0,
        'text-align': 'center'
      });

    this._border = this._root
      .append('div')
      .classed('scola border', true)
      .styles({
        'background': '#CCC',
        'display': 'none',
        'height': 'inherit',
        'order': 1,
        'width': '1px'
      });

    this._text = this._root
      .append('div')
      .classed('scola text', true)
      .styles({
        'flex': 1,
        'order': 2
      });
  }

  destroy() {
    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  text(text) {
    if (typeof text === 'undefined') {
      return this._text;
    }

    this._text.text(text);
    return this;
  }

  direction(direction) {
    this._direction = direction;
    this._style();

    return this;
  }

  first(first = true) {
    this._first = first;
    this._style();

    return this;
  }

  _style() {
    if (this._first === true) {
      if (this._direction === 'column') {
        this._root.style('border-top-color', '#FFF');
      } else if (this._direction === 'row') {
        this._border.style('display', 'none');
      }
    } else if (this._first === false) {
      if (this._direction === 'column') {
        this._root.style('border-top-color', '#CCC');
      } else if (this._direction === 'row') {
        this._border.style('display', 'inline-flex');
      }
    }
  }
}
