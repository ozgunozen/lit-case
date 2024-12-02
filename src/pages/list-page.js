import {LitElement, html, css} from 'lit';
import store from '../store/index';
import {Router} from '@vaadin/router';

import {
  setSortColumn,
  setPage,
  setSearchQuery,
  setViewMode,
} from '../store/reducers/appReducer';

import {
  selectCurrentPage,
  selectPaginatedEmployees,
  selectTotalPages,
  selectViewMode,
} from '../store/selectors';

import {deleteEmployee} from '../store/reducers/employeesReducer';

export class ListPage extends LitElement {
  static properties = {
    employees: {type: Array},
    totalPages: {type: Number},
    currentPage: {type: Number},
    viewMode: {type: String},
  };

  static styles = css`
    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;

      @media (min-width: 768px) {
        flex-direction: row;
      }
    }

    .view-mode-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .view-mode-button img {
      height: 32px;
    }

    .list-header-menu {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .list-header-menu input {
      border-radius: 8px;
      border: 1px solid #ff6600;
      color: #ff6600;
      padding: 8px;
      outline: none;
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.totalPages = 1;
    this.currentPage = 1;
    this.viewMode = 'table';

    this.unsubscribe = store.subscribe(() => {
      this.updateStateFromStore();
    });

    this.updateStateFromStore();
  }

  updateStateFromStore() {
    const state = store.getState();
    this.employees = selectPaginatedEmployees(state);
    this.totalPages = selectTotalPages(state);
    this.currentPage = selectCurrentPage(state);
    this.viewMode = selectViewMode(state);
    this.requestUpdate();
  }

  disconnectedCallback() {
    this.unsubscribe();
    super.disconnectedCallback();
  }

  handleSort(event) {
    const {column} = event.detail;
    store.dispatch(setSortColumn(column));
  }

  handleDelete(event) {
    const {id} = event.detail;
    store.dispatch(deleteEmployee(id));
  }

  handleEdit(event) {
    const {id} = event.detail;
    Router.go(`/edit/${id}`);
  }

  handleSearch(e) {
    const query = e.target.value;
    store.dispatch(setSearchQuery(query));
  }

  handlePageChange(event) {
    const {page} = event.detail;
    store.dispatch(setPage(page));
  }

  changeViewMode(mode) {
    store.dispatch(setViewMode(mode));
  }

  render() {
    return html`
      <layout-component>
        <div class="list-header">
          <h1>Employee List</h1>
          <div class="list-header-menu">
            <input
              type="text"
              placeholder="Search..."
              @input="${this.handleSearch}"
            />
            <button
              class="view-mode-button"
              @click="${() => this.changeViewMode('table')}"
            >
              <img src="/public/images/list.png" />
            </button>
            <button
              class="view-mode-button"
              @click="${() => this.changeViewMode('grid')}"
            >
              <img src="/public/images/grid.png" />
            </button>
          </div>
        </div>

        <div>
          ${this.viewMode === 'table'
            ? html`
                <employee-table
                  .employees="${this.employees}"
                  @sort="${this.handleSort}"
                  @delete="${this.handleDelete}"
                  @edit="${this.handleEdit}"
                ></employee-table>
              `
            : html`<employee-grid
                .employees="${this.employees}"
              ></employee-grid>`}
        </div>
        <pagination-component
          .currentPage="${this.currentPage}"
          .totalPages="${this.totalPages}"
          @page-change="${this.handlePageChange}"
        ></pagination-component>
      </layout-component>
    `;
  }
}

customElements.define('list-page', ListPage);
