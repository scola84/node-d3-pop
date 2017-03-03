import PopButton from './src/button';
import Container from './src/container';

import PopAction from './src/popaction';
import PopOut from './src/popout';
import PopOver from './src/popover';
import PopUp from './src/popup';

import PopAlert from './src/helper/alert';
import PopConfirm from './src/helper/confirm';

let instance = null;

function container() {
  if (!instance) {
    instance = new Container();
  }

  return instance;
}

function popAction() {
  return new PopAction()
    .container(container());
}

function popButton() {
  return new PopButton();
}

function popOut() {
  return new PopOut()
    .container(container());
}

function popOver() {
  return new PopOver()
    .container(container());
}

function popUp() {
  return new PopUp()
    .container(container());
}

function popAlert() {
  return new PopAlert()
    .container(container());
}

function popConfirm() {
  return new PopConfirm()
    .container(container());
}

export {
  popAction,
  popButton,
  popOut,
  popOver,
  popUp,
  popAlert,
  popConfirm
};
