import {html, css, LitElement} from 'lit';

export class ConfirmationModal extends LitElement {
  static properties = {
    isOpen: {type: Boolean},
    message: {type: String},
  };

  static styles = css`
    :host {
      display: block;
    }

    .backdrop {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10;
    }

    .modal {
      background: white;
      border-radius: 8px;
      padding: 16px;
      width: 300px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .modal h2 {
      font-size: 1.25rem;
      margin: 0 0 16px;
    }

    .modal .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }

    .modal button {
      padding: 8px 16px;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .modal button.cancel {
      background: #ccc;
      color: white;
    }

    .modal button.confirm {
      background: #ff6600;
      color: white;
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.message = '';
  }

  close() {
    this.isOpen = false;
    this.dispatchEvent(
      new CustomEvent('close-modal', {bubbles: true, composed: true})
    );
  }

  confirm() {
    this.dispatchEvent(
      new CustomEvent('confirm-action', {bubbles: true, composed: true})
    );
    this.isOpen = false;
  }

  render() {
    if (!this.isOpen) {
      return null;
    }

    return html`
      <div class="backdrop">
        <div class="modal">
          <h2>${this.message || 'Are you sure?'}</h2>
          <div class="actions">
            <button class="cancel" @click="${this.close}">Cancel</button>
            <button class="confirm" @click="${this.confirm}">Confirm</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);
