import {html, LitElement} from 'lit';
import store from '../store/index.js';
import {updateEmployee} from '../store/reducers/employeesReducer.js';
import {Router} from '@vaadin/router';
import {selectEmployeeById} from '../store/selectors.js';
import {showToast} from '../store/reducers/appReducer.js';

export class EditPage extends LitElement {
  static properties = {
    employeeId: {type: String},
    employee: {type: Object},
  };

  constructor() {
    super();
    this.employeeId = null;
    this.employee = null;
  }

  onBeforeEnter(location) {
    this.id = location.params.id;
  }

  connectedCallback() {
    super.connectedCallback();
    const state = store.getState();
    this.employee = selectEmployeeById(this.id)(state);
  }

  handleFormSubmit(event) {
    const {employee} = event.detail;
    store.dispatch(updateEmployee(employee));
    store.dispatch(
      showToast({
        message: `Employee ${employee.firstName} ${employee.lastName} updated!`,
      })
    );
    Router.go('/');
  }

  render() {
    return html`
      <layout-component>
        <h1>Edit Employee</h1>
        <employee-form
          mode="edit"
          .employee="${this.employee}"
          @form-submit="${this.handleFormSubmit}"
        ></employee-form>
      </layout-component>
    `;
  }
}

customElements.define('edit-page', EditPage);
