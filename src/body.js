import { select } from 'd3-selection';

export default class Body {
  constructor() {
    this._direction = null;

    this._root = select('body')
      .append('div')
      .classed('scola body', true)
      .styles({
        'display': 'flex',
        'flex-direction': 'column',
        'text-align': 'center',
        'width': '100%'
      });

    this._title = this._root
      .append('div')
      .classed('scola title', true)
      .styles({
        'display': 'none',
        'font-weight': 'bold',
        'line-height': '1.5em',
        'padding': '1em'
      });

    this._text = this._root
      .append('div')
      .classed('scola text', true)
      .styles({
        'display': 'none',
        'line-height': '1.5em',
        'padding': '1em'
      });

    this._buttons = this._root
      .append('div')
      .classed('scola buttons', true)
      .styles({
        'display': 'flex'
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

  append(button, action = true) {
    if (action === true) {
      if (this._direction === 'column' ||
        this._buttons.select('button').size() === 0) {

        button.left();
      }

      if (this._direction === 'column' &&
        this._buttons.select('button').size() === 0) {

        button.top();
      }

      this._buttons.node().appendChild(button.root().node());
    } else if (action === false) {
      button.root().remove();
    }

    return this;
  }

  text(text) {
    if (typeof text === 'undefined') {
      return this._text;
    }

    this._text
      .style('display', 'inline')
      .text(text);

    if (this._title.style('display') !== 'none') {
      this._text.style('padding-top', 0);
      this._title.style('padding-bottom', '0.5em');
    }

    return this;
  }

  title(text) {
    if (typeof text === 'undefined') {
      return this._title;
    }

    this._title
      .style('display', 'inline')
      .text(text);

    return this;
  }

  direction(direction) {
    this._direction = direction;

    this._buttons.style('flex-direction', direction);
    this._buttons.style('height', direction === 'row' ?
      '3em' : 'initial');

    return this;
  }
}
