import PopOut from './popout';

export default class PopAction extends PopOut {
  build() {
    super.build();

    this.outer
      .classed('out', false)
      .classed('action', true);

    this.inner.styles({
      'background': 'none',
      'display': 'flex',
      'flex-direction': 'column'
    });

    const styles = Object.assign({}, this.options, {
      'bottom': '0.5em',
      'height': 'initial',
      'left': '0.5em',
      'right': '0.5em',
      'width': 'initial'
    });

    this.innerMedia = this.inner
      .media('not all and (min-width: ' + this.options.width + ')')
      .styles(styles)
      .media('not all and (min-height: ' + this.options.height + ')')
      .styles(styles)
      .start();
  }

  destroy() {
    this.innerMedia.destroy();
    super.destroy();
  }
}
