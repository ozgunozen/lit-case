import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

export class LayoutComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background-color: #f8f8f8;
    }

    main {
      padding: 1rem;
    }

    header {
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      cursor: pointer;
      height: 32px;
    }

    .container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 16px;
    }

    .plus-icon {
      height: 16px;
    }

    .create-button {
      display: flex;
      align-items: center;
      padding: 8px;
      gap: 8px;
      background: white;
      border: none;
      cursor: pointer;
    }

    .menu {
      display: flex;
      gap: 8px;
    }
  `;

  handleCreate() {
    Router.go('/create');
  }

  handleLogoClick() {
    Router.go('/');
  }

  render() {
    return html`
      <div class="container">
        <header>
          <img class="logo" src="/public/images/logo.png" @click="${this.handleLogoClick}" />
          <div class="menu">
            <button class="create-button" @click="${this.handleCreate}">
              <img class="plus-icon" src="/public/images/plus.png" /> Add New
            </button>
            <language-switcher></language-switcher />
          </div>
        </header>
        <main>
          <slot></slot>
        </main>
        <toast-message></toast-message>
      </div>
    `;
  }
}

customElements.define('layout-component', LayoutComponent);
