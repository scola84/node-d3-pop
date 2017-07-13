import PopAlert from './alert';
import PopButton from '../button';

export default class PopConfirm extends PopAlert {
  constructor() {
    super();

    this._cancelButton = new PopButton();
    this._cancelCallback = null;
  }

  destroy() {
    this._unbindCancel();
    super.destroy();
  }

  cancel(text = null, callback = () => {}) {
    if (text === null) {
      return this._cancelButton;
    }

    this._cancelCallback = callback;

    this._cancelButton
      .button()
      .attrs({
        'tabindex': 0
      });

    this._cancelButton
      .text()
      .text(text);

    this._popup
      .body()
      .append(this._cancelButton);

    this._bindCancel();
    return this;
  }

  _bindCancel() {
    this._cancelButton.root().on('click', () => this._clickCancel());
  }

  _unbindCancel() {
    this._cancelButton.root().on('click', null);
  }

  _clickCancel() {
    this._cancelCallback();
    this.destroy();
  }
}
