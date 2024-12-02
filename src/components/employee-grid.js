import {css, html, LitElement} from 'lit';

export class EmployeeGrid extends LitElement {
  static properties = {
    employees: {type: Array},
  };

  static styles = css`
    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }

    .employee-grid-item {
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 4px;
    }
  `;

  constructor() {
    super();
    this.employees = [];
  }

  render() {
    return html`
      <div class="employee-grid">
        ${this.employees.map(
          (emp) => html`
            <div class="employee-grid-item">
              <h3>${emp.firstName} ${emp.lastName}</h3>
              <p><strong>Department:</strong> ${emp.department}</p>
              <p><strong>Position:</strong> ${emp.position}</p>
              <p><strong>Email:</strong> ${emp.emailAddress}</p>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('employee-grid', EmployeeGrid);
