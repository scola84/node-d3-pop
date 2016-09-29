import { event, select } from 'd3-selection';
import { slider } from '@scola/d3-slider';
import 'd3-selection-multi';
import 'd3-transition';
import '@scola/d3-media';

export default class PopOver {
  constructor(container) {
    this._container = container;

    this._width = null;
    this._height = null;
    this._styles = null;

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
        'opacity': 0,
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
        'transform': 'scale(1)',
        'width': '100%'
      });

    this._container.append(this, true);
    this._bind();
  }

  destroy() {
    this._unbind();
    this._hide(() => {
      if (this._media) {
        this._media.destroy();
        this._media = null;
      }

      if (this._slider) {
        this._slider.destroy();
        this._slider = null;
      }

      this._container.append(this, false);
      this._container = null;

      this._root.dispatch('destroy');
      this._root.remove();
      this._root = null;
    });
  }

  root() {
    return this._root;
  }

  media(width = '34em', height = '39em', styles = {}) {
    if (width === null) {
      return this._media;
    }

    if (width === false) {
      this._media.destroy();
      this._media = null;

      return this;
    }

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

    this._show();

    return this;
  }

  slider(action) {
    if (typeof action === 'undefined') {
      return this._slider;
    }

    if (action === false) {
      this._slider.destroy();
      this._slider = null;

      return this;
    }

    this._slider = slider()
      .remove(true)
      .rotate(false);

    this._inner.node()
      .appendChild(this._slider.root().node());

    return this;
  }

  _bind() {
    this._root.on('click.scola-pop-over', () => this.destroy());
    this._inner.on('click.scola-pop-over', () => event.stopPropagation());
  }

  _unbind() {
    this._root.on('click.scola-pop-over', null);
    this._inner.on('click.scola-pop-over', null);
  }

  _show() {
    this._root
      .transition()
      .style('opacity', 1);

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
      });
  }

  _hide(callback) {
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
      .style('top', bodyHeight + 'px');

    this._root
      .transition()
      .style('opacity', 0)
      .on('end', callback);
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
