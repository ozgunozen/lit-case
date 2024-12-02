import {html, css, LitElement} from 'lit';
import store from './../store/index.js';
import {hideToast} from '../store/reducers/appReducer.js';

export class ToastMessage extends LitElement {
  static properties = {
    message: {type: String},
    isVisible: {type: Boolean},
  };

  static styles = css`
    :host {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 1000;
      display: block;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 0;
      transform: translateX(30px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      background-color: #4caf50;
    }

    .toast.show {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
  `;

  constructor() {
    super();
    this.message = '';
    this.isVisible = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      this.updateStateFromStore();
    });

    this.updateStateFromStore();
  }

  updateStateFromStore() {
    const state = store.getState();
    const {message, isVisible} = state.app.toast;
    this.message = message;
    this.isVisible = isVisible;

    if (isVisible) {
      setTimeout(() => {
        store.dispatch(hideToast());
      }, 3000);
    }

    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    return html`
      <div class="toast ${this.type} ${this.isVisible ? 'show' : ''}">
        ${this.message}
      </div>
    `;
  }
}

customElements.define('toast-message', ToastMessage);
