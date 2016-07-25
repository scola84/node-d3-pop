import { select } from 'd3-selection';

export default class PopButton {
  constructor() {
    this._direction = 'row';
    this._first = false;

    this._root = select('body')
      .append('div')
      .remove()
      .classed('scola button', true)
      .styles({
        'border-top': '1px solid',
        'cursor': 'pointer',
        'display': 'flex',
        'flex': 1,
        'height': '3em',
        'line-height': '3em',
        'text-align': 'center'
      });

    this._border = this._root
      .append('div')
      .classed('scola border', true)
      .styles({
        'background': '#CCC',
        'height': '100%',
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

    this._style();
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
    return this._style();
  }

  first(first) {
    this._first = first;
    return this._style();
  }

  _style() {
    if (this._direction === 'column') {
      this._border.style('display', 'none');

      if (this._first) {
        this._root.style('border-top-color', 'transparent');
      } else {
        this._root.style('border-top-color', '#CCC');
      }
    } else if (this._direction === 'row') {
      this._root.style('border-top-color', '#CCC');

      if (this._first) {
        this._border.style('display', 'none');
      } else {
        this._border.style('display', 'inline-flex');
      }
    }

    return this;
  }
}
