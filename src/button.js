import { select } from 'd3';

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

    this._container = this._root
      .append('div')
      .classed('scola text', true)
      .styles({
        'flex': 1,
        'order': 2
      });

    this._text = this._container
      .append('button')
      .attrs({
        'tabindex': -1,
        'type': 'button'
      })
      .styles({
        'background': 'none',
        'border': '1px solid transparent',
        'color': 'inherit',
        'cursor': 'inherit',
        'line-height': '2em',
        'margin': 0,
        'padding': '0 0.25em'
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

  first(value = null) {
    if (value === null) {
      return this._first;
    }

    this._first = value;
    return this._style();
  }

  direction(value = null) {
    if (value === null) {
      return this._direction;
    }

    this._direction = value;
    return this._style();
  }

  tabindex(value = null) {
    if (value === null) {
      return this._text.attr('tabindex');
    }

    this._text.attr('tabindex', value);
    return this;
  }

  text(value = null) {
    if (value === null) {
      return this._text;
    }

    this._text.text(value);
    return this;
  }

  _style() {
    if (this._direction === 'column') {
      this._border.style('display', 'none');
      this._root.style('border-top-color', () => {
        return this._first ? 'transparent' : '#CCC';
      });
    } else if (this._direction === 'row') {
      this._root.style('border-top-color', '#CCC');
      this._border.style('display', () => {
        return this._first ? 'none' : 'inline-flex';
      });
    }

    return this;
  }
}
