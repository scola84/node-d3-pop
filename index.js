import Button from './src/button';
import Container from './src/container';
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

export function popover() {
  return new PopOver(container());
}

export function popup() {
  return new PopUp(container());
}
