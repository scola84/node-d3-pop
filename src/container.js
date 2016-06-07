import { select, selection, event } from 'd3-selection';

export default class Container {
  constructor() {
    this.children = new Set();
    this.build();
  }

  build() {
    this.outer = select('body')
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

    selection().on('keyup.scola-pop', this.handleKeyUp.bind(this));
  }

  destroy() {
    selection().on('keyup.scola-pop', null);

    this.children.forEach((child) => child.destroy());
    this.outer.remove();
  }

  node() {
    return this.outer.node();
  }

  append(child) {
    this.children.add(child);
    this.node().appendChild(child.node());

    return this.show();
  }

  remove(child) {
    this.children.delete(child);
    child.node().remove();

    return this.hide();
  }

  handleKeyUp() {
    if (event.keyCode === 27 && this.children.size > 0) {
      [...this.children].pop().destroy();
    }
  }

  show() {
    if (this.children.size === 1) {
      this.outer.style('display', 'block');
    }

    return this;
  }

  hide() {
    if (this.children.size === 0) {
      this.outer.style('display', 'none');
    }

    return this;
  }
}
