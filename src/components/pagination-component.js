import {html, css, LitElement} from 'lit';

export class PaginationComponent extends LitElement {
  static properties = {
    currentPage: {type: Number}, // Current active page
    totalPages: {type: Number}, // Total number of pages
    maxVisiblePages: {type: Number}, // Maximum number of page buttons to display
  };

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      margin: 16px 0;
    }

    .pagination {
      display: flex;
      gap: 0.5rem;
    }

    button {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
      cursor: pointer;
      color: #333;
      transition: all 0.3s ease;
    }

    button:hover:not(:disabled) {
      background-color: #f4f4f4;
    }

    button:disabled {
      background-color: #f9f9f9;
      border-color: #eee;
      color: #aaa;
      cursor: not-allowed;
    }

    button.active {
      background-color: #ff6600;
      border-color: #ff6600;
      color: #fff;
      font-weight: bold;
    }

    button.previous-next {
      background-color: #f1f1f1;
      border-color: #ddd;
    }

    button.previous-next:hover:not(:disabled) {
      background-color: #e9e9e9;
    }

    button.previous-next img {
      height: 12px;
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.maxVisiblePages = 5; // Default to showing 5 pages
  }

  dispatchPageChange(page) {
    if (page !== this.currentPage) {
      this.dispatchEvent(new CustomEvent('page-change', {detail: {page}}));
    }
  }

  getVisiblePageRange() {
    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(this.currentPage - half, 1);
    let end = Math.min(start + this.maxVisiblePages - 1, this.totalPages);

    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(end - this.maxVisiblePages + 1, 1);
    }

    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  render() {
    const visiblePages = this.getVisiblePageRange();

    return html`
      <div class="pagination">
        <!-- Previous Button -->
        <button
          class="previous-next"
          ?disabled="${this.currentPage === 1}"
          @click="${() => this.dispatchPageChange(this.currentPage - 1)}"
        >
          <img src="/public/images/left.png" />
        </button>

        <!-- Page Buttons -->
        ${visiblePages.map(
          (page) => html`
            <button
              class="${page === this.currentPage ? 'active' : ''}"
              ?disabled="${page === this.currentPage}"
              @click="${() => this.dispatchPageChange(page)}"
            >
              ${page}
            </button>
          `
        )}

        <!-- Next Button -->
        <button
          class="previous-next"
          ?disabled="${this.currentPage === this.totalPages}"
          @click="${() => this.dispatchPageChange(this.currentPage + 1)}"
        >
          <img src="/public/images/right.png" />
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent);
