/* eslint prefer-reflect: "off" */

import { event, select } from 'd3';
import { slider } from '@scola/d3-slider';
import debounce from 'lodash-es/debounce.js';

export default class PopOut {
  constructor() {
    this._container = null;
    this._anchorElement = null;
    this._insideElement = null;

    this._lock = false;
    this._height = null;
    this._styles = null;
    this._width = null;

    this._media = null;
    this._slider = null;

    this._fontSize = parseFloat(select('body').style('font-size'));
    this._isFullScreen = null;
    this._positions = [];

    this._root = select('body')
      .append('div')
      .remove()
      .classed('scola popout', true)
      .styles({
        'background': 'rgba(0, 0, 0, 0.5)',
        'bottom': '0px',
        'left': '0px',
        'opacity': 0,
        'position': 'fixed',
        'right': '0px',
        'top': '0px'
      });

    this._wrapper = this._root
      .append('div')
      .classed('scola wrapper', true)
      .styles({
        'height': '100%',
        'position': 'absolute',
        'width': '100%'
      });

    this._inner = this._wrapper
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
      });

    this._triangle = this._wrapper
      .append('div')
      .classed('scola triangle', true)
      .styles({
        'border-color': 'transparent',
        'border-style': 'solid',
        'border-width': '0.75em',
        'height': '0px',
        'position': 'absolute',
        'width': '0px',
        'z-index': 2
      });

    this._handleRerender = debounce(() => this._rerender(), 100);

    this._bind();
    this.show();
  }

  destroy() {
    this._unbind();
    this._deleteMedia();
    this._deleteSlider();

    this._container.append(this, false);
    this._container = null;

    this._handleRerender.cancel();
    this._handleRerender = null;

    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  inner() {
    return this._inner;
  }

  container(value = null) {
    if (value === null) {
      return this._container;
    }

    this._container = value;
    this._container.append(this);

    return this;
  }

  anchor(element = null) {
    if (element === null) {
      return this._anchorElement;
    }

    this._anchorElement = element;
    return this;
  }

  inside(element = null) {
    if (element === null) {
      return this._insideElement;
    }

    this._insideElement = element;
    return this;
  }

  lock(value = null) {
    if (value === null) {
      return this._lock;
    }

    this._lock = value;
    return this;
  }

  size(width = '21.333em', height = '21.333em', styles = {}) {
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

  left() {
    this._positions.push('left');

    if (this._fullScreen()) {
      return this;
    }

    if (this._insideElement) {
      this._leftInside();
    } else {
      this._leftAnchor();
    }

    if (this._positions.length === 1) {
      this._leftTriangleVertical();
    } else {
      this._leftTriangleHorizontal();
    }

    return this;
  }

  right() {
    this._positions.push('right');

    if (this._fullScreen()) {
      return this;
    }

    if (this._insideElement) {
      this._rightInside();
    } else {
      this._rightAnchor();
    }

    if (this._positions.length === 1) {
      this._rightTriangleVertical();
    } else {
      this._rightTriangleHorizontal();
    }

    return this;
  }

  center() {
    this._positions.push('center');

    if (this._fullScreen()) {
      return this;
    }

    if (this._insideElement) {
      this._centerInside();
    } else {
      this._centerAnchor();
    }

    if (this._positions.length === 2) {
      this._centerTriangleHorizontal();
    }

    return this;
  }

  top() {
    this._positions.push('top');

    if (this._fullScreen()) {
      return this;
    }

    if (this._insideElement) {
      this._topInside();
    } else {
      this._topAnchor();
    }

    if (this._positions.length === 1) {
      this._topTriangleHorizontal();
    } else {
      this._topTriangleVertical();
    }

    return this;
  }

  bottom() {
    this._positions.push('bottom');

    if (this._fullScreen()) {
      return this;
    }

    if (this._insideElement) {
      this._bottomInside();
    } else {
      this._bottomAnchor();
    }

    if (this._positions.length === 1) {
      this._bottomTriangleHorizontal();
    } else {
      this._bottomTriangleVertical();
    }

    return this;
  }

  middle() {
    this._positions.push('middle');

    if (this._fullScreen()) {
      return this;
    }

    if (this._insideElement) {
      this._middleInside();
    } else {
      this._middleAnchor();
    }

    if (this._positions.length === 2) {
      this._middleTriangleVertical();
    }

    return this;
  }

  show(callback = () => {}) {
    this._root
      .transition()
      .style('opacity', 1)
      .on('end', callback);
  }

  hide(callback = () => {}) {
    this._root
      .transition()
      .style('opacity', 0)
      .on('end', callback);
  }

  click() {
    if (this._lock === true) {
      return;
    }

    this.hide();
  }

  _bind() {
    select(window).on('resize.scola-pop', () => this._handleRerender());
    this._root.on('click.scola-pop', () => this.click());
    this._inner.on('click.scola-pop', () => event.stopPropagation());
  }

  _unbind() {
    select(window).on('resize.scola-pop', null);
    this._root.on('click.scola-pop', null);
    this._inner.on('click.scola-pop', null);
  }

  _insertMedia(width, height, styles) {
    this._width = width;
    this._height = height;
    this._styles = Object.assign({
      'border-radius': '1em'
    }, styles);

    this._media = this._wrapper
      .media(`not all and (min-width: ${width})`)
      .call(() => this._fullScreen(true))
      .media(`not all and (min-height: ${height})`)
      .call(() => this._fullScreen(true))
      .media(`(min-width: ${width}) and (min-height: ${height})`)
      .style('width', width)
      .style('height', height)
      .styles(this._styles)
      .call(() => this._fullScreen(false))
      .start();

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

    this._inner.node()
      .appendChild(this._slider.root().node());

    return this;
  }

  _deleteSlider() {
    if (this._slider) {
      this._slider.destroy();
      this._slider = null;
    }

    return this;
  }

  _leftInside() {
    const position = this._getPosition(this._insideElement);
    this._wrapper.style('left', (position.x + (this._fontSize / 2)) + 'px');

    return this;
  }

  _leftAnchor() {
    const position = this._getPosition(this._anchorElement);
    const dimensions = this._getDimensions(this._anchorElement);

    if (this._positions.length === 2) {
      this._wrapper.style('left', (position.x) + 'px');
    } else if (this._positions.length === 1) {
      this._wrapper.style('left', (position.x + dimensions.width) + 'px');
    }

    return this;
  }

  _leftTriangleHorizontal() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerPosition = this._getPosition(this._wrapper);

    this._triangle.styles({
      'margin-left': '-0.75em',
      'left': (anchorPosition.x +
        (anchorDimensions.width / 2) -
        innerPosition.x) + 'px'
    });
  }

  _leftTriangleVertical() {
    this._triangle.styles({
      'border-right-color': '#FAFAFA',
      'border-left-width': '0px',
      'margin-left': '-0.75em'
    });

    this._wrapper.style('margin-left', '1em');
  }

  _rightInside() {
    const insidePosition = this._getPosition(this._insideElement);
    const insideDimensions = this._getDimensions(this._insideElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    this._wrapper.styles({
      'left': (insidePosition.x +
        insideDimensions.width -
        innerDimensions.width -
        (this._fontSize / 2)) + 'px'
    });

    return this;
  }

  _rightAnchor() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    if (this._positions.length === 2) {
      this._wrapper.style('left', (anchorPosition.x +
        anchorDimensions.width -
        innerDimensions.width) + 'px');
    } else if (this._positions.length === 1) {
      this._wrapper.style('left', (anchorPosition.x -
        innerDimensions.width) + 'px');
    }

    return this;
  }

  _rightTriangleHorizontal() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerPosition = this._getPosition(this._wrapper);

    this._triangle.styles({
      'margin-left': '-0.75em',
      'left': (anchorPosition.x +
        (anchorDimensions.width / 2) -
        innerPosition.x) + 'px'
    });
  }

  _rightTriangleVertical() {
    this._triangle.styles({
      'border-left-color': '#FAFAFA',
      'border-right-width': '0px',
      'margin-right': '-0.75em',
      'right': '0px'
    });

    this._wrapper.style('margin-left', '-1em');
  }

  _centerInside() {
    const insidePosition = this._getPosition(this._insideElement);
    const insideDimensions = this._getDimensions(this._insideElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    this._wrapper.styles({
      'left': (insidePosition.x +
        (insideDimensions.width / 2) -
        (innerDimensions.width / 2)) + 'px'
    });

    return this;
  }

  _centerAnchor() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    this._wrapper.styles({
      'left': (anchorPosition.x +
        (anchorDimensions.width / 2) -
        (innerDimensions.width / 2)) + 'px'
    });

    return this;
  }

  _centerTriangleHorizontal() {
    const innerDimensions = this._getDimensions(this._wrapper);

    this._triangle.styles({
      'margin-left': '-0.75em',
      'left': (innerDimensions.width / 2) + 'px'
    });
  }

  _topInside() {
    const position = this._getPosition(this._insideElement);
    this._wrapper.style('top', (position.y - (this._fontSize / 2)) + 'px');

    return this;
  }

  _topAnchor() {
    const position = this._getPosition(this._anchorElement);
    const dimensions = this._getDimensions(this._anchorElement);

    if (this._positions.length === 2) {
      this._wrapper.style('top', (position.y) + 'px');
    } else if (this._positions.length === 1) {
      this._wrapper.style('top', (position.y + dimensions.height) + 'px');
    }

    return this;
  }

  _topTriangleHorizontal() {
    this._triangle.styles({
      'border-bottom-color': '#FAFAFA',
      'border-top-width': '0px',
      'margin-top': '-0.75em'
    });

    this._wrapper.style('margin-top', '1em');
  }

  _topTriangleVertical() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerPosition = this._getPosition(this._wrapper);

    this._triangle.styles({
      'margin-top': '-0.75em',
      'top': (anchorPosition.y +
        (anchorDimensions.height / 2) -
        innerPosition.y) + 'px'
    });
  }

  _bottomInside() {
    const insidePosition = this._getPosition(this._insideElement);
    const insideDimensions = this._getDimensions(this._insideElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    this._wrapper.style('top', (insidePosition.y +
      insideDimensions.height -
      innerDimensions.height +
      (this._fontSize / 2)) + 'px');

    return this;
  }

  _bottomAnchor() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    if (this._positions.length === 2) {
      this._wrapper.style('top', (anchorPosition.y +
        anchorDimensions.height -
        innerDimensions.height) + 'px');
    } else if (this._positions.length === 1) {
      this._wrapper.style('top', (anchorPosition.y -
        innerDimensions.height) + 'px');
    }

    return this;
  }

  _bottomTriangleHorizontal() {
    this._triangle.styles({
      'border-top-color': '#FAFAFA',
      'border-bottom-width': '0px',
      'bottom': '0px',
      'margin-bottom': '-0.75em'
    });

    this._wrapper.style('margin-top', '-1em');
  }

  _bottomTriangleVertical() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerPosition = this._getPosition(this._wrapper);

    this._triangle.styles({
      'margin-top': '-0.75em',
      'top': (anchorPosition.y +
        (anchorDimensions.height / 2) -
        innerPosition.y) + 'px'
    });
  }

  _middleInside() {
    const insidePosition = this._getPosition(this._insideElement);
    const insideDimensions = this._getDimensions(this._insideElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    this._wrapper.style('top', (insidePosition.y +
      (insideDimensions.height / 2) -
      (innerDimensions.height / 2)) + 'px');

    return this;
  }

  _middleAnchor() {
    const anchorPosition = this._getPosition(this._anchorElement);
    const anchorDimensions = this._getDimensions(this._anchorElement);
    const innerDimensions = this._getDimensions(this._wrapper);

    this._wrapper.style('top', (anchorPosition.y +
      (anchorDimensions.height / 2) -
      (innerDimensions.height / 2)) + 'px');

    return this;
  }

  _middleTriangleVertical() {
    const innerDimensions = this._getDimensions(this._wrapper);

    this._triangle.styles({
      'margin-top': '-0.75em',
      'top': (innerDimensions.height / 2) + 'px'
    });
  }

  _fullScreen(fullScreen = null) {
    if (fullScreen === null) {
      return this._isFullScreen;
    }

    this._isFullScreen = fullScreen;

    if (fullScreen) {
      this._wrapper.styles({
        'left': '0px',
        'margin-left': null,
        'margin-top': null,
        'top': null
      });

      this._triangle.style('display', 'none');
    } else {
      this._triangle.style('display', 'block');
    }

    return this;
  }

  _rerender() {
    const positions = this._positions;
    this._positions = [];

    positions.forEach((position) => {
      this._setPosition(position);
    });
  }

  _setPosition(position) {
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

  _getDimensions(element) {
    const node = element.node();

    return {
      height: node.offsetHeight,
      width: node.offsetWidth
    };
  }

  _getPosition(element) {
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
