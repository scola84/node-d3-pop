import parallel from 'async/parallel';
import { event, select } from 'd3';
import { slider } from '@scola/d3-slider';

export default class PopOver {
  constructor() {
    this._container = null;

    this._fade = true;
    this._lock = true;
    this._move = true;

    this._height = null;
    this._styles = null;
    this._width = null;

    this._media = null;
    this._slider = null;

    this._root = select('body')
      .append('div')
      .remove()
      .classed('scola popover', true)
      .styles({
        'align-items': 'center',
        'background': 'rgba(0, 0, 0, 0.5)',
        'bottom': '0px',
        'display': 'flex',
        'justify-content': 'center',
        'left': '0px',
        'position': 'fixed',
        'right': '0px',
        'top': '0px'
      });

    this._inner = this._root
      .append('div')
      .classed('scola inner', true)
      .styles({
        'background': '#FFF',
        'height': '100%',
        'overflow': 'hidden',
        'position': 'relative',
        'transform': 'scale(1)',
        'width': '100%'
      });

    this._bind();
  }

  destroy() {
    this._unbind();
    this._deleteMedia();
    this._deleteSlider();

    this._container.append(this, false);
    this._container = null;

    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  container(value = null) {
    if (value === null) {
      return this._container;
    }

    this._container = value;
    this._container.append(this);

    return this;
  }

  fade(value = null) {
    if (value === null) {
      return this._fade;
    }

    this._fade = value;
    return this;
  }

  lock(value = null) {
    if (value === null) {
      return this._lock;
    }

    this._lock = value;
    return this;
  }

  move(value = null) {
    if (value === null) {
      return this._move;
    }

    this._move = value;
    return this;
  }

  size(width = '34em', height = '39em', styles = {}) {
    if (width === null) {
      return this._media;
    }

    if (width === false) {
      return this._deleteMedia();
    }

    if (!this._media) {
      this._insertMedia(width, height, styles);
    }

    return this;
  }

  slider(action = true) {
    if (action === false) {
      return this._deleteSlider();
    }

    if (!this._slider) {
      this._insertSlider();
    }

    return this._slider;
  }

  show(callback = () => {}) {
    parallel([
      (c) => this._showFade(c),
      (c) => this._showMove(c)
    ], callback);
  }

  hide(callback = () => {}) {
    parallel([
      (c) => this._hideFade(c),
      (c) => this._hideMove(c)
    ], callback);
  }

  click() {
    if (this._lock === true) {
      return;
    }

    this.hide(() => this.destroy());
  }

  _bind() {
    this._root.on('click.scola-pop', () => this.click());
    this._inner.on('click.scola-pop', () => event.stopPropagation());
  }

  _unbind() {
    this._root.on('click.scola-pop', null);
    this._inner.on('click.scola-pop', null);
  }

  _showFade(callback = () => {}) {
    if (!this._fade) {
      callback();
      return;
    }

    this._root
      .style('opacity', 0)
      .transition()
      .style('opacity', 1)
      .on('end', callback);
  }

  _showMove(callback = () => {}) {
    if (!this._move) {
      callback();
      return;
    }

    const {
      bodyHeight,
      bodyWidth,
      innerHeight,
      innerWidth
    } = this._dimensions();

    this._inner.styles({
      position: 'absolute',
      top: bodyHeight + 'px',
      left: ((bodyWidth - innerWidth) / 2) + 'px'
    });

    this._inner.transition()
      .style('top', ((bodyHeight - innerHeight) / 2) + 'px')
      .on('end', () => {
        this._inner.styles({
          'position': 'relative',
          'top': null,
          'left': null
        });

        callback();
      });
  }

  _hideFade(callback = () => {}) {
    if (!this._fade) {
      callback();
      return;
    }

    this._root
      .transition()
      .style('opacity', 0)
      .on('end', callback);
  }

  _hideMove(callback = () => {}) {
    if (!this._move) {
      callback();
      return;
    }

    const {
      bodyHeight,
      bodyWidth,
      innerHeight,
      innerWidth
    } = this._dimensions();

    this._inner.styles({
      position: 'absolute',
      top: ((bodyHeight - innerHeight) / 2) + 'px',
      left: ((bodyWidth - innerWidth) / 2) + 'px'
    });

    this._inner
      .transition()
      .style('top', bodyHeight + 'px')
      .on('end', callback);
  }

  _insertMedia(width, height, styles) {
    this._width = width;
    this._height = height;
    this._styles = Object.assign({
      'border-radius': '1em'
    }, styles);

    this._media = this._inner
      .media(`(min-width: ${width}) and (min-height: ${height})`)
      .style('width', this._width)
      .style('height', this._height)
      .styles(this._styles)
      .start();

    this.show();

    return this;
  }

  _deleteMedia() {
    if (this._media) {
      this._media.destroy();
      this._media = null;
    }

    return this;
  }

  _insertSlider() {
    this._slider = slider()
      .remove(true)
      .rotate(false);

    this._inner
      .append(() => this._slider.root().node());

    return this;
  }

  _deleteSlider() {
    if (this._slider) {
      this._slider.destroy();
      this._slider = null;
    }

    return this;
  }

  _dimensions() {
    return {
      bodyHeight: parseFloat(select('body').style('height'), 10),
      bodyWidth: parseFloat(select('body').style('width'), 10),
      innerWidth: parseFloat(this._inner.style('width'), 10),
      innerHeight: parseFloat(this._inner.style('height'), 10)
    };
  }
}
