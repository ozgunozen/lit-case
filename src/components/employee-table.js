import {html, LitElement, css} from 'lit';
import store from '../store';
import {showToast} from '../store/reducers/appReducer';

export class EmployeeTable extends LitElement {
  static properties = {
    employees: {type: Array},
    selectedEmployeeId: {type: Number},
    isModalOpen: {type: Boolean},
  };

  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      display: block;
      overflow: auto;
    }

    th {
      background-color: #fff;
      color: #ff6600;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 1px;
      border-bottom: 1px solid #f0f0f0;
    }

    td {
      background-color: #fff;
      padding: 12px;
      text-align: left;
      color: #333;
      font-size: 14px;
      border-bottom: 1px solid #f0f0f0;
    }

    td .action-buttons {
      display: flex;
    }

    th,
    td {
      padding-left: 20px;
      padding-right: 20px;
    }

    td:last-child {
      text-align: center;
    }

    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .action-button img {
      height: 16px;
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployeeId = null;
    this.isModalOpen = false;
  }

  openModal(id) {
    this.selectedEmployeeId = id;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEmployeeId = null;
  }

  confirmDelete() {
    const employee = this.employees.find(
      (e) => e.id === this.selectedEmployeeId
    );

    this.dispatchEvent(
      new CustomEvent('delete', {detail: {id: this.selectedEmployeeId}})
    );

    store.dispatch(
      showToast({
        message: `Employee ${employee.firstName} ${employee.lastName} deleted successfully!`,
      })
    );

    this.closeModal();
  }

  dispatchSort(column) {
    this.dispatchEvent(new CustomEvent('sort', {detail: {column}}));
  }

  dispatchEdit(id) {
    this.dispatchEvent(new CustomEvent('edit', {detail: {id}}));
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            <th @click="${() => this.dispatchSort('id')}">ID</th>
            <th @click="${() => this.dispatchSort('firstName')}">First Name</th>
            <th @click="${() => this.dispatchSort('lastName')}">Last Name</th>
            <th @click="${() => this.dispatchSort('dateOfEmployment')}">
              Date of Employment
            </th>
            <th @click="${() => this.dispatchSort('dateOfBirth')}">
              Date of Birth
            </th>
            <th @click="${() => this.dispatchSort('phoneNumber')}">
              Phone Number
            </th>
            <th @click="${() => this.dispatchSort('emailAddress')}">
              Email Address
            </th>
            <th @click="${() => this.dispatchSort('department')}">
              Department
            </th>
            <th @click="${() => this.dispatchSort('position')}">Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
            (emp) => html`
              <tr>
                <td>${emp.id}</td>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.dateOfEmployment}</td>
                <td>${emp.dateOfBirth}</td>
                <td>${emp.phoneNumber}</td>
                <td>${emp.emailAddress}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-button"
                      @click="${() => this.dispatchEdit(emp.id)}"
                    >
                      <img src="/public/images/edit.png" />
                    </button>
                    <button
                      class="action-button"
                      @click="${() => this.openModal(emp.id)}"
                    >
                      <img src="/public/images/trash.png" />
                    </button>
                  </div>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>

      <confirmation-modal
        .isOpen="${this.isModalOpen}"
        message="Are you sure you want to delete this employee?"
        @close-modal="${this.closeModal}"
        @confirm-action="${this.confirmDelete}"
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
