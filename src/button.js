import { select } from 'd3-selection';

export default class PopButton {
  constructor() {
    this._root = select('body')
      .append('button')
      .remove()
      .classed('scola button', true)
      .styles({
        'background': '#FFF',
        'border': 0,
        'border-left': '1px solid #CCC',
        'border-top': '1px solid #CCC',
        'cursor': 'pointer',
        'flex': 1,
        'height': '3em',
        'line-height': '3em',
        'padding': 0,
        'text-align': 'center'
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

  left() {
    this._root.style('border-left-style', 'none');
    return this;
  }

  text(text) {
    this._root.text(text);
    return this;
  }

  top() {
    this._root.style('border-top-style', 'none');
    return this;
  }
}
