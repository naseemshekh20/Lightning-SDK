import Lightning from '../Lightning'
import { getActivePage, restore } from './index'

export class RoutedApp extends Lightning.Component {
  static _template() {
    return {
      Pages: {
        forceZIndexContext: true,
      },
      /**
       * This is a default Loading page that will be made visible
       * during data-provider on() you CAN override in child-class
       */
      Loading: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff000000,
        visible: false,
        zIndex: 99,
        Label: {
          mount: 0.5,
          x: 960,
          y: 540,
          text: {
            text: 'Loading..',
          },
        },
      },
    }
  }

  static _states() {
    return [
      class Loading extends this {
        $enter() {
          this.tag('Loading').visible = true
        }

        $exit() {
          this.tag('Loading').visible = false
        }
      },
      class Widgets extends this {
        $enter(args, widget) {
          // store widget reference
          this._widget = widget

          // since it's possible that this behaviour
          // is non-remote driven we force a recalculation
          // of the focuspath
          this._refocus()
        }

        _getFocused() {
          // we delegate focus to selected widget
          // so it can consume remotecontrol presses
          return this._widget
        }

        // if we want to widget to widget focus delegation
        reload(widget) {
          this._widget = widget
          this._refocus()
        }

        _handleKey() {
          restore()
        }
      },
    ]
  }

  /**
   * Return location where pages need to be stored
   */
  get pages() {
    return this.tag('Pages')
  }

  /**
   * Tell router where widgets are stored
   */
  get widgets() {
    return this.tag('Widgets')
  }

  /**
   * we MUST register _handleBack method so the Router
   * can override it
   * @private
   */
  _handleBack() {}

  /**
   * we MUST register _captureKey for dev quick-navigation
   * (via keyboard 1-9)
   */
  _captureKey() {}

  /**
   * We MUST return Router.activePage() so the new Page
   * can listen to the remote-control.
   */
  _getFocused() {
    return getActivePage()
  }
}