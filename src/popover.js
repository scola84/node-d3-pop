import { select, event } from 'd3-selection';
import { slider } from '@scola/d3-slider';

export default class PopOver {
  constructor(container, options) {
    this.container = container;

    this.options = Object.assign({
      'border-radius': '1em',
      'height': '39em',
      'width': '34em'
    }, options);

    this.build();
  }

  build() {
    this.outer = select('body')
      .append('div')
      .classed('scola popover', true)
      .styles({
        'align-items': 'center',
        'background': 'rgba(0, 0, 0, 0.5)',
        'bottom': 0,
        'display': 'flex',
        'justify-content': 'center',
        'left': 0,
        'opacity': 0,
        'position': 'fixed',
        'right': 0,
        'top': 0
      })
      .on('click', () => {
        this.destroy();
      });

    this.outer
      .transition()
      .style('opacity', 1);

    this.inner = this.outer
      .append('div')
      .classed('scola inner', true)
      .styles({
        'background': '#FFF',
        'height': '100%',
        'overflow': 'hidden',
        'transform': 'scale(1)',
        'width': '100%'
      })
      .on('click', () => {
        event.stopPropagation();
      });

    this.media = this.inner
      .media('(min-width: ' + this.options.width + ') and ' +
        '(min-height: ' + this.options.height + ')')
      .styles(this.options)
      .start();

    const {
      bodyHeight,
      bodyWidth,
      innerHeight,
      innerWidth
    } = this.dimensions();

    this.inner.styles({
      position: 'absolute',
      top: bodyHeight,
      left: (bodyWidth - innerWidth) / 2
    });

    this.inner.transition()
      .style('top', (bodyHeight - innerHeight) / 2 + 'px')
      .on('end', () => {
        this.inner.styles({
          'position': 'relative',
          'top': null,
          'left': null
        });
      });
  }

  slider() {
    if (!this._slider) {
      this._slider = slider();
      this.inner.node().appendChild(this._slider.root().node());
    }

    return this._slider;
  }

  destroy() {
    this.media.destroy();

    const {
      bodyHeight,
      bodyWidth,
      innerHeight,
      innerWidth
    } = this.dimensions();

    this.inner.styles({
      position: 'absolute',
      top: (bodyHeight - innerHeight) / 2,
      left: (bodyWidth - innerWidth) / 2
    });

    this.inner
      .transition()
      .style('top', bodyHeight + 'px');

    this.outer
      .transition()
      .style('opacity', 0)
      .on('end', () => {
        this.outer.dispatch('destroy');
        this.container.remove(this);
      });
  }

  node() {
    return this.outer.node();
  }

  dimensions() {
    return {
      bodyHeight: parseFloat(select('body').style('height'), 10),
      bodyWidth: parseFloat(select('body').style('width'), 10),
      innerWidth: parseFloat(this.inner.style('width'), 10),
      innerHeight: parseFloat(this.inner.style('height'), 10)
    };
  }
}
