import {
  event,
  select,
  transition
} from 'd3';

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

    if (this._media === null) {
      this._insertMedia(width, height, styles);
    }

    return this;
  }

  slider(action = true) {
    if (action === false) {
      return this._deleteSlider();
    }

    if (this._slider === null) {
      this._insertSlider();
    }

    return this._slider;
  }

  show(value) {
    const timeline = transition();

    if (value === true) {
      this._showFade(timeline);
      this._showMove(timeline);
    } else if (value === false) {
      this._hideFade(timeline);
      this._hideMove(timeline);
    }

    return timeline;
  }

  click() {
    if (this._lock === true) {
      return;
    }

    this
      .show(false)
      .on('end', () => this.destroy());
  }

  _bind() {
    this._root.on('click.scola-pop', () => this.click());
    this._inner.on('click.scola-pop', () => event.stopPropagation());
  }

  _unbind() {
    this._root.on('click.scola-pop', null);
    this._inner.on('click.scola-pop', null);
  }

  _showFade(timeline) {
    if (this._fade === false) {
      return;
    }

    this._root
      .style('opacity', 0)
      .transition(timeline)
      .style('opacity', 1);
  }

  _showMove(timeline) {
    if (this._move === false) {
      return;
    }

    const {
      bodyHeight,
      bodyWidth,
      innerHeight,
      innerWidth
    } = this._dimensions();

    this._inner
      .styles({
        'position': 'absolute',
        'top': bodyHeight + 'px',
        'left': ((bodyWidth - innerWidth) / 2) + 'px'
      })
      .transition(timeline)
      .style('top', ((bodyHeight - innerHeight) / 2) + 'px')
      .on('end', () => {
        this._inner.styles({
          'position': 'relative',
          'top': null,
          'left': null
        });
      });
  }

  _hideFade(timeline) {
    if (this._fade === false) {
      return;
    }

    this._root
      .transition(timeline)
      .style('opacity', 0);
  }

  _hideMove(timeline) {
    if (this._move === false) {
      return;
    }

    const {
      bodyHeight,
      bodyWidth,
      innerHeight,
      innerWidth
    } = this._dimensions();

    this._inner
      .styles({
        'position': 'absolute',
        'top': ((bodyHeight - innerHeight) / 2) + 'px',
        'left': ((bodyWidth - innerWidth) / 2) + 'px'
      })
      .transition(timeline)
      .style('top', bodyHeight + 'px');
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

    this.show(true);
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
      bodyHeight: select('body').height(),
      bodyWidth: select('body').width(),
      innerWidth: this._inner.width(),
      innerHeight: this._inner.height()
    };
  }
}
