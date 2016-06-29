import PopButton from './src/button';
import Container from './src/container';
import PopAction from './src/popaction';
import PopOut from './src/popout';
import PopOver from './src/popover';
import PopUp from './src/popup';

let instance = null;

function container() {
  if (!instance) {
    instance = new Container();
  }

  return instance;
}

export function popAction(options) {
  return new PopAction(container(), options);
}

export function popButton() {
  return new PopButton();
}

export function popOut(options) {
  return new PopOut(container(), options);
}

export function popOver(options) {
  return new PopOver(container(), options);
}

export function popUp() {
  return new PopUp(container());
}
