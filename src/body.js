import { select } from 'd3-selection';
import 'd3-selection-multi';

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

  direction(value) {
    this._direction = value;

    this._buttons.style('flex-direction', value);

    if (this._direction === 'row') {
      this._buttons.style('height', '3em');
    }

    return this;
  }

  title(value = null) {
    if (value === null) {
      return this._title;
    }

    if (value === false) {
      return this._deleteTitle();
    }

    if (this._title) {
      return this._updateTitle(value);
    }

    return this._insertTitle(value);
  }

  text(value = null) {
    if (value === null) {
      return this._text;
    }

    if (value === false) {
      return this._deleteText();
    }

    if (this._text) {
      return this._updateText(value);
    }

    return this._insertText(value);
  }

  append(button, action = true) {
    if (action === true) {
      this._buttons.node().appendChild(button.root().node());
    } else if (action === false) {
      button.root().remove();
    }

    if (this._direction === 'column') {
      this._buttons.style('height',
        ((this._buttons.select('div.button').size() + 1) * 3) + 'em');
    }

    button.direction(this._direction);
    return this;
  }

  _insertTitle(title) {
    this._title = this._root
      .append('div')
      .classed('scola title', true)
      .styles({
        'font-weight': 'bold',
        'line-height': '1.5em',
        'order': 1,
        'padding': '1em'
      })
      .text(title);

    return this;
  }

  _updateTitle(title) {
    this._title.text(title);
    return this;
  }

  _deleteTitle() {
    if (this._title) {
      this._title.remove();
      this._title = null;
    }

    return this;
  }

  _insertText(text) {
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
      this._text.style('padding-top', '0px');
      this._title.style('padding-bottom', '0.5em');
    }

    return this;
  }

  _updateText(text) {
    this._text.text(text);
    return this;
  }

  _deleteText() {
    if (this._text) {
      this._text.remove();
      this._text = null;
    }

    if (this._title) {
      this._title.style('padding-bottom', '1em');
    }

    return this;
  }
}
