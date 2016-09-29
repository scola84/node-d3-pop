import Body from './body';
import PopOut from './popout';
import 'd3-selection-multi';

export default class PopAction extends PopOut {
  constructor(container) {
    super(container);

    this._body = null;
    this._mediaInner = null;

    this._root
      .classed('out', false)
      .classed('action', true);

    this._inner.styles({
      'height': 'initial'
    });
  }

  destroy() {
    if (this._body) {
      this._body.destroy();
      this._body = null;
    }

    if (this._mediaInner) {
      this._mediaInner.destroy();
      this._mediaInner = null;
    }

    super.destroy();
  }

  body(action) {
    if (typeof action === 'undefined') {
      return this._body;
    }

    if (action === false) {
      this._body.destroy();
      this._body = null;

      return this;
    }

    this._body = new Body();
    this._body.direction('column');

    this._inner.node().appendChild(this._body.root().node());

    return this;
  }

  media(width = '21.333em', height = '21.333em', styles = {}) {
    const result = super.media(width, height, styles);

    if (width === null) {
      return result;
    }

    if (width === false) {
      this._mediaInner.destroy();
      this._mediaInner = null;

      return result;
    }

    width = this._width;
    height = this._height;
    styles = Object.assign({}, this._styles, {
      'bottom': '0.5em',
      'height': 'initial',
      'left': '0.5em',
      'right': '0.5em',
      'width': 'initial'
    });

    this._mediaInner = this._inner
      .media(`not all and (min-width: ${width})`)
      .styles(styles)
      .media(`not all and (min-height: ${height})`)
      .styles(styles)
      .start();

    return result;
  }
}
