import {html, LitElement} from 'lit';
import store from '../store/index.js';
import {addEmployee} from '../store/reducers/employeesReducer.js';
import {Router} from '@vaadin/router';
import {showToast} from '../store/reducers/appReducer.js';

export class CreatePage extends LitElement {
  handleFormSubmit(event) {
    const {employee} = event.detail;
    store.dispatch(addEmployee({...employee}));
    store.dispatch(
      showToast({
        message: `Employee ${employee.firstName} ${employee.lastName} created!`,
      })
    );
    Router.go('/');
  }

  render() {
    return html`
      <layout-component>
        <h1>Create Employee</h1>
        <employee-form
          mode="create"
          @form-submit="${this.handleFormSubmit}"
        ></employee-form>
      </layout-component>
    `;
  }
}

customElements.define('create-page', CreatePage);
