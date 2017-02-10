import Body from './body';
import PopOut from './popout';

export default class PopAction extends PopOut {
  constructor() {
    super();

    this._mediaInner = null;
    this._body = null;

    this._root
      .classed('out', false)
      .classed('action', true);

    this._inner.styles({
      'height': 'initial'
    });
  }

  destroy() {
    this._deleteMediaInner();
    this._deleteBody();
    super.destroy();
  }

  size(width = '21.333em', height = '21.333em', styles = {}) {
    const result = super.size(width, height, styles);

    if (width === null) {
      return result;
    }

    if (width === false) {
      return this._deleteMediaInner(result);
    }

    return this._insertMediaInner(result);
  }

  body(action = true) {
    if (action === false) {
      return this._deleteBody();
    }

    if (!this._body) {
      this._insertBody();
    }

    return this._body;
  }

  _insertMediaInner(result) {
    const width = this._width;
    const height = this._height;

    const styles = Object.assign({}, this._styles, {
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

  _deleteMediaInner(result) {
    if (this._mediaInner) {
      this._mediaInner.destroy();
      this._mediaInner = null;
    }

    return result;
  }

  _insertBody() {
    this._body = new Body();
    this._body.direction('column');

    this._inner.node()
      .appendChild(this._body.root().node());

    return this;
  }

  _deleteBody() {
    if (this._body) {
      this._body.destroy();
      this._body = null;
    }

    return this;
  }
}
