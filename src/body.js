import { select } from 'd3-selection';

export default class Body {
  constructor() {
    this._direction = null;
    this._title = null;
    this._text = null;

    this._root = select('body')
      .append('div')
      .remove()
      .classed('scola body', true)
      .styles({
        'display': 'flex',
        'flex-direction': 'column',
        'text-align': 'center',
        'width': '100%'
      });

    this._buttons = this._root
      .append('div')
      .classed('scola buttons', true)
      .styles({
        'display': 'flex',
        'order': 3
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

    if (text === false) {
      this._text.remove();
      this._text = null;

      return this;
    }

    this._text = this._root
      .append('div')
      .classed('scola text', true)
      .styles({
        'line-height': '1.5em',
        'order': 2,
        'padding': '1em'
      })
      .text(text);

    if (this._title) {
      this._text.style('padding-top', 0);
      this._title.style('padding-bottom', '0.5em');
    }

    return this;
  }

  title(text) {
    if (typeof text === 'undefined') {
      return this._title;
    }

    if (text === false) {
      this._title.remove();
      this._title = null;

      return this;
    }

    this._title = this._root
      .append('div')
      .classed('scola title', true)
      .styles({
        'font-weight': 'bold',
        'line-height': '1.5em',
        'order': 1,
        'padding': '1em'
      })
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
