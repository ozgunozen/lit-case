import {html, css, LitElement} from 'lit';

export class LanguageSwitcher extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: Arial, sans-serif;
    }

    .select-box {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      cursor: pointer;
      background-color: #fff;
      position: relative;
    }

    .select-box img {
      width: 20px;
      height: 100%;
      margin-right: 8px;
    }

    .options {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      z-index: 10;
      width: 100%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .options.open {
      display: block;
    }

    .option {
      padding: 5px 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }

    .option:hover {
      background-color: #f0f0f0;
    }

    .option img {
      width: 20px;
      height: 100%;
      margin-right: 8px;
    }
  `;

  constructor() {
    super();
    this.selectedLang = document.documentElement.lang || 'en';
    this.isOpen = false;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = (event) => {
    if (!this.shadowRoot.contains(event.target)) {
      this.isOpen = false;
      this.requestUpdate();
    }
  };

  toggleDropdown(event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.requestUpdate();
  }

  selectLanguage(lang) {
    this.selectedLang = lang;
    document.documentElement.lang = lang;
    this.isOpen = false;
    this.requestUpdate();
  }

  render() {
    const languages = [
      {code: 'en', label: 'English', icon: '/public/images/en.png'},
      {code: 'tr', label: 'Türkçe', icon: '/public/images/tr.png'},
    ];

    const selectedLang = languages.find(
      (lang) => lang.code === this.selectedLang
    );

    return html`
      <div class="select-box" @click="${this.toggleDropdown}">
        <img src="${selectedLang.icon}" alt="${selectedLang.label}" />
        <span>${selectedLang.label}</span>
      </div>
      <div class="options ${this.isOpen ? 'open' : ''}">
        ${languages.map(
          (lang) => html`
            <div
              class="option"
              @click="${() => this.selectLanguage(lang.code)}"
            >
              <img src="${lang.icon}" alt="${lang.label}" />
              <span>${lang.label}</span>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('language-switcher', LanguageSwitcher);
