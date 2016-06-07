import Button from './src/button';
import Container from './src/container';
import PopOut from './src/popout';
import PopOver from './src/popover';
import PopUp from './src/popup';

let instance = null;

export function button() {
  return new Button();
}

export function container() {
  if (!instance) {
    instance = new Container();
  }

  return instance;
}

export function popout(options) {
  return new PopOut(container(), options);
}

export function popover(options) {
  return new PopOver(container(), options);
}

export function popup() {
  return new PopUp(container());
}
