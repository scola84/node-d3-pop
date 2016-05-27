const Button = require('./button');
const Over = require('./over');
const Up = require('./up');

const d3 = require('d3-selection');
require('d3-selection-multi');
require('d3-transition');

class Pop {
  constructor() {
    this.children = new Set();
    this.outer = d3.select('body>div.pop');

    if (this.outer.empty()) {
      this.build();
    }
  }

  build() {
    this.outer = d3.select('body')
      .append('div')
      .classed('scola pop', true)
      .styles({
        'display': 'none',
        'bottom': 0,
        'left': 0,
        'position': 'fixed',
        'right': 0,
        'top': 0,
        'z-index': 1000
      });

    d3.selection().on('keyup.scola-pop', this.handleKeyUp.bind(this));
  }

  destroy() {
    d3.selection().on('keyup.scola-pop', null);

    this.children.forEach((child) => child.destroy());
    this.outer.remove();
  }

  node() {
    return this.outer.node();
  }

  over() {
    return new Over(this);
  }

  up() {
    return new Up(this);
  }

  button() {
    return new Button();
  }

  append(child) {
    this.children.add(child);
    this.node().appendChild(child.node());
    this.show();
  }

  remove(child) {
    this.children.delete(child);
    child.node().remove();
    this.hide();
  }

  handleKeyUp() {
    if (d3.event.keyCode === 27 && this.children.size > 0) {
      [...this.children].pop().destroy();
    }
  }

  show() {
    if (this.children.size === 1) {
      this.outer.style('display', 'block');
    }
  }

  hide() {
    if (this.children.size === 0) {
      this.outer.style('display', 'none');
    }
  }
}

module.exports = Pop;
