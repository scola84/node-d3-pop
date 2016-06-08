/* eslint prefer-reflect: "off" */

import { select, event } from 'd3-selection';
import { debounce } from 'lodash-es';

export default class PopOut {
  constructor(container, options) {
    this.container = container;

    this.options = Object.assign({
      'border-radius': '1em',
      'height': '21.333em',
      'width': '21.333em'
    }, options);

    this.fontSize = parseFloat(select('body').style('font-size'));
    this.isFullScreen = null;
    this.positions = [];

    this.build();
  }

  build() {
    this.outer = select('body')
      .append('div')
      .classed('scola out', true)
      .styles({
        'background': 'rgba(0, 0, 0, 0.5)',
        'bottom': 0,
        'left': 0,
        'opacity': 0,
        'position': 'fixed',
        'right': 0,
        'top': 0
      })
      .on('click', () => {
        this.destroy();
      });

    this.outer.transition().style('opacity', 1);

    this.wrapper = this.outer
      .append('div')
      .classed('scola wrapper', true)
      .styles({
        'height': '100%',
        'position': 'absolute',
        'width': '100%'
      });

    this.inner = this.wrapper
      .append('div')
      .classed('scola inner', true)
      .styles({
        'background': '#FFF',
        'border-radius': 'inherit',
        'height': '100%',
        'overflow': 'hidden',
        'position': 'absolute',
        'transform': 'scale(1)',
        'width': '100%'
      })
      .on('click', () => {
        event.stopPropagation();
      });

    this.triangle = this.wrapper
      .append('div')
      .classed('scola triangle', true)
      .styles({
        'border-color': 'transparent',
        'border-style': 'solid',
        'border-width': '0.75em',
        'height': 0,
        'position': 'absolute',
        'width': 0,
        'z-index': 2
      });

    this.media = this.wrapper
      .media('not all and (min-width: ' + this.options.width + ')')
      .call(() => {
        this.fullScreen(true);
      })
      .media('not all and (min-height: ' + this.options.height + ')')
      .call(() => {
        this.fullScreen(true);
      })
      .media('(min-width: ' + this.options.width + ') and ' +
        '(min-height: ' + this.options.height + ')')
      .styles(this.options)
      .call(() => {
        this.fullScreen(false);
      })
      .start();

    this.debouncer = debounce(this.rerender.bind(this), 250);
    window.addEventListener('resize', this.debouncer);

    this.container.append(this);
  }

  node() {
    return this.outer.node();
  }

  destroy() {
    window.removeEventListener('resize', this.debouncer);
    this.media.destroy();

    this.outer
      .transition()
      .style('opacity', 0)
      .on('end', () => {
        this.container.remove(this);
      });
  }

  anchor(element) {
    this.anchorElement = element;
    return this;
  }

  inside(element) {
    this.insideElement = element;
    return this;
  }

  left() {
    this.positions.push('left');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.leftInside();
    } else {
      this.leftAnchor();
    }

    if (this.positions.length === 1) {
      this.leftTriangleVertical();
    } else {
      this.leftTriangleHorizontal();
    }

    return this;
  }

  leftInside() {
    const position = this.getPosition(this.insideElement);
    this.wrapper.style('left', position.x + (this.fontSize / 2));

    return this;
  }

  leftAnchor() {
    const position = this.getPosition(this.anchorElement);
    const dimensions = this.getDimensions(this.anchorElement);

    if (this.positions.length === 2) {
      this.wrapper.style('left', position.x);
    } else if (this.positions.length === 1) {
      this.wrapper.style('left', position.x + dimensions.width);
    }

    return this;
  }

  leftTriangleHorizontal() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerPosition = this.getPosition(this.wrapper);

    this.triangle.styles({
      'margin-left': '-0.75em',
      'left': anchorPosition.x +
        (anchorDimensions.width / 2) -
        innerPosition.x
    });
  }

  leftTriangleVertical() {
    this.triangle.styles({
      'border-right-color': '#FAFAFA',
      'border-left-width': 0,
      'margin-left': '-0.75em'
    });

    this.wrapper.style('margin-left', '1em');
  }

  right() {
    this.positions.push('right');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.rightInside();
    } else {
      this.rightAnchor();
    }

    if (this.positions.length === 1) {
      this.rightTriangleVertical();
    } else {
      this.rightTriangleHorizontal();
    }

    return this;
  }

  rightInside() {
    const insidePosition = this.getPosition(this.insideElement);
    const insideDimensions = this.getDimensions(this.insideElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    this.wrapper.styles({
      'left': insidePosition.x +
        insideDimensions.width -
        innerDimensions.width -
        (this.fontSize / 2)
    });

    return this;
  }

  rightAnchor() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    if (this.positions.length === 2) {
      this.wrapper.style('left', anchorPosition.x +
        anchorDimensions.width -
        innerDimensions.width);
    } else if (this.positions.length === 1) {
      this.wrapper.style('left', anchorPosition.x -
        innerDimensions.width);
    }

    return this;
  }

  rightTriangleHorizontal() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerPosition = this.getPosition(this.wrapper);

    this.triangle.styles({
      'margin-left': '-0.75em',
      'left': anchorPosition.x +
        (anchorDimensions.width / 2) -
        innerPosition.x
    });
  }

  rightTriangleVertical() {
    this.triangle.styles({
      'border-left-color': '#FAFAFA',
      'border-right-width': 0,
      'margin-right': '-0.75em',
      'right': 0
    });

    this.wrapper.style('margin-left', '-1em');
  }

  center() {
    this.positions.push('center');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.centerInside();
    } else {
      this.centerAnchor();
    }

    if (this.positions.length === 2) {
      this.centerTriangleHorizontal();
    }

    return this;
  }

  centerInside() {
    const insidePosition = this.getPosition(this.insideElement);
    const insideDimensions = this.getDimensions(this.insideElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    this.wrapper.styles({
      'left': insidePosition.x +
        (insideDimensions.width / 2) -
        (innerDimensions.width / 2)
    });

    return this;
  }

  centerAnchor() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    this.wrapper.styles({
      'left': anchorPosition.x +
        (anchorDimensions.width / 2) -
        (innerDimensions.width / 2)
    });

    return this;
  }

  centerTriangleHorizontal() {
    const innerDimensions = this.getDimensions(this.wrapper);

    this.triangle.styles({
      'margin-left': '-0.75em',
      'left': innerDimensions.width / 2
    });
  }

  top() {
    this.positions.push('top');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.topInside();
    } else {
      this.topAnchor();
    }

    if (this.positions.length === 1) {
      this.topTriangleHorizontal();
    } else {
      this.topTriangleVertical();
    }

    return this;
  }

  topInside() {
    const position = this.getPosition(this.insideElement);
    this.wrapper.style('top', position.y - (this.fontSize / 2));

    return this;
  }

  topAnchor() {
    const position = this.getPosition(this.anchorElement);
    const dimensions = this.getDimensions(this.anchorElement);

    if (this.positions.length === 2) {
      this.wrapper.style('top', position.y);
    } else if (this.positions.length === 1) {
      this.wrapper.style('top', position.y + dimensions.height);
    }

    return this;
  }

  topTriangleHorizontal() {
    this.triangle.styles({
      'border-bottom-color': '#FAFAFA',
      'border-top-width': 0,
      'margin-top': '-0.75em'
    });

    this.wrapper.style('margin-top', '1em');
  }

  topTriangleVertical() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerPosition = this.getPosition(this.wrapper);

    this.triangle.styles({
      'margin-top': '-0.75em',
      'top': anchorPosition.y +
        (anchorDimensions.height / 2) -
        innerPosition.y
    });
  }

  bottom() {
    this.positions.push('bottom');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.bottomInside();
    } else {
      this.bottomAnchor();
    }

    if (this.positions.length === 1) {
      this.bottomTriangleHorizontal();
    } else {
      this.bottomTriangleVertical();
    }

    return this;
  }

  bottomInside() {
    const insidePosition = this.getPosition(this.insideElement);
    const insideDimensions = this.getDimensions(this.insideElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    this.wrapper.style('top', insidePosition.y +
      insideDimensions.height -
      innerDimensions.height +
      (this.fontSize / 2)
    );

    return this;
  }

  bottomAnchor() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    if (this.positions.length === 2) {
      this.wrapper.style('top', anchorPosition.y +
        anchorDimensions.height -
        innerDimensions.height);
    } else if (this.positions.length === 1) {
      this.wrapper.style('top', anchorPosition.y -
        innerDimensions.height);
    }

    return this;
  }

  bottomTriangleHorizontal() {
    this.triangle.styles({
      'border-top-color': '#FAFAFA',
      'border-bottom-width': 0,
      'bottom': 0,
      'margin-bottom': '-0.75em'
    });

    this.wrapper.style('margin-top', '-1em');
  }

  bottomTriangleVertical() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerPosition = this.getPosition(this.wrapper);

    this.triangle.styles({
      'margin-top': '-0.75em',
      'top': anchorPosition.y +
        (anchorDimensions.height / 2) -
        innerPosition.y
    });
  }

  middle() {
    this.positions.push('middle');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.middleInside();
    } else {
      this.middleAnchor();
    }

    if (this.positions.length === 2) {
      this.middleTriangleVertical();
    }

    return this;
  }

  middleInside() {
    const insidePosition = this.getPosition(this.insideElement);
    const insideDimensions = this.getDimensions(this.insideElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    this.wrapper.style('top', insidePosition.y +
      (insideDimensions.height / 2) -
      (innerDimensions.height / 2)
    );

    return this;
  }

  middleAnchor() {
    const anchorPosition = this.getPosition(this.anchorElement);
    const anchorDimensions = this.getDimensions(this.anchorElement);
    const innerDimensions = this.getDimensions(this.wrapper);

    this.wrapper.style('top', anchorPosition.y +
      (anchorDimensions.height / 2) -
      (innerDimensions.height / 2)
    );

    return this;
  }

  middleTriangleVertical() {
    const innerDimensions = this.getDimensions(this.wrapper);

    this.triangle.styles({
      'margin-top': '-0.75em',
      'top': innerDimensions.height / 2
    });
  }

  fullScreen(fullScreen) {
    this.isFullScreen = fullScreen;

    if (fullScreen) {
      this.wrapper.styles({
        'left': 0,
        'margin-left': null,
        'margin-top': null,
        'top': null
      });

      this.triangle.style('display', 'none');
    } else {
      this.triangle.style('display', 'block');
    }

    return this;
  }

  rerender() {
    const positions = this.positions;
    this.positions = [];

    this.setPositions(...positions);
  }

  setPositions(...positions) {
    positions.forEach((position) => {
      this.setPosition(position);
    });
  }

  setPosition(position) {
    switch (position) {
      case 'left':
        this.left();
        break;
      case 'right':
        this.right();
        break;
      case 'center':
        this.center();
        break;
      case 'top':
        this.top();
        break;
      case 'bottom':
        this.bottom();
        break;
      case 'middle':
        this.middle();
        break;
    }

    return this;
  }

  getDimensions(element) {
    const node = element.node();

    return {
      height: node.offsetHeight,
      width: node.offsetWidth
    };
  }

  getPosition(element) {
    const position = {
      x: 0,
      y: 0
    };

    let node = element.node();

    while (node) {
      position.x += node.offsetLeft - node.scrollLeft + node.clientLeft;
      position.y += node.offsetTop - node.scrollTop + node.clientTop;
      node = node.offsetParent;
    }

    return position;
  }
}
