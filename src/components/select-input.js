import {html, css, LitElement} from 'lit';

export class SelectInput extends LitElement {
  static properties = {
    label: {type: String},
    name: {type: String},
    value: {type: String},
    options: {type: Array},
    error: {type: String},
  };

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .input-container {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
    }

    label {
      font-size: 0.9rem;
      margin-bottom: 0.4rem;
      color: #333;
    }

    select {
      font-size: 1rem;
      padding: 0.6rem 0.8rem;
      border: 1px solid #ccc;
      border-radius: 0.4rem;
      outline: none;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      background-color: #fff;
      appearance: none;
      background-image: url('/public/images/select-arrows.png');
      background-repeat: no-repeat;
      background-position: right 0.8rem center;
      background-size: 1rem;
    }

    select:focus {
      border-color: #ff6600;
      box-shadow: 0 0 0 4px rgba(255, 102, 0, 0.2);
    }

    select.error {
      border-color: #e53935;
    }

    .error-message {
      color: #e53935;
      font-size: 0.8rem;
      margin-top: 0.4rem;
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.name = '';
    this.value = '';
    this.options = [];
    this.error = '';
  }

  handleInput(e) {
    this.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {name: this.name, value: e.target.value},
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="input-container">
        <label for="${this.name}">${this.label}</label>
        <select
          id="${this.name}"
          name="${this.name}"
          class="${this.error ? 'error' : ''}"
          @change="${this.handleInput}"
        >
          <option value="" disabled ?selected="${!this.value}">
            Select an option
          </option>
          ${this.options.map(
            (option) => html`
              <option value="${option}" ?selected="${this.value === option}">
                ${option}
              </option>
            `
          )}
        </select>
        ${this.error ? html`<p class="error-message">${this.error}</p>` : ''}
      </div>
    `;
  }
}

customElements.define('select-input', SelectInput);
