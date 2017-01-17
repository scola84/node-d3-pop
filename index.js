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

export function popAction() {
  return new PopAction()
    .container(container());
}

export function popButton() {
  return new PopButton();
}

export function popOut() {
  return new PopOut()
    .container(container());
}

export function popOver() {
  return new PopOver()
    .container(container());
}

export function popUp() {
  return new PopUp()
    .container(container());
}
