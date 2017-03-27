import PopUp from '../popup';
import PopButton from '../button';

export default class popAlert {
  constructor() {
    this._popup = new PopUp().lock(true);
    this._okButton = new PopButton();
    this._okCallback = null;
  }

  destroy() {
    this._unbindOk();

    this._popup
      .show(false)
      .on('end', () => {
        this._popup.destroy();
      });
  }

  popup() {
    return this._popup;
  }

  container(value) {
    this._popup.container(value);
    return this;
  }

  title(value) {
    this._popup
      .body()
      .title(value);

    return this;
  }

  text(value) {
    this._popup
      .body()
      .text(value);

    return this;
  }

  ok(text, callback = () => {}) {
    this._okCallback = callback;

    this._okButton
      .text(text)
      .tabindex(0);

    this._popup
      .body()
      .append(this._okButton);

    this._bindOk();
    return this;
  }

  _bindOk() {
    this._okButton.root().on('click', () => this._clickOk());
  }

  _unbindOk() {
    this._okButton.root().on('click', null);
  }

  _clickOk() {
    this._okCallback();
    this.destroy();
  }
}
