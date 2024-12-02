import {html, fixture, assert} from '@open-wc/testing';
import {EmployeeForm} from './../src/components/employee-form.js';
import store from '../src/store/index.js';
import {
  addEmployee,
  setEmployees,
} from '../src/store/reducers/employeesReducer.js';

suite('EmployeeForm', () => {
  setup(() => {
    store.dispatch(setEmployees([]));
  });

  test('is defined', () => {
    const el = document.createElement('employee-form');
    assert.instanceOf(el, EmployeeForm);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    assert.shadowDom.equal(
      el,
      `
      <form>
        <text-input label="First Name" name="firstName"></text-input>
        <text-input label="Last Name" name="lastName"></text-input>
        <date-input label="Date of Employment" name="dateOfEmployment"></date-input>
        <date-input label="Date of Birth" name="dateOfBirth"></date-input>
        <text-input label="Phone Number" name="phoneNumber"></text-input>
        <text-input label="Email Address" name="emailAddress"></text-input>
        <select-input label="Department" name="department"></select-input>
        <select-input label="Position" name="position"></select-input>
        <button type="button">Create</button>
      </form>
    `
    );
  });

  test('updates employee state on input change', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const firstNameInput = el.shadowRoot.querySelector(
      'text-input[name="firstName"]'
    );
    firstNameInput.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {name: 'firstName', value: 'Alice'},
      })
    );
    assert.equal(el.employee.firstName, 'Alice');
  });

  test('validates required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.handleSubmit();
    assert.deepEqual(el.validationErrors, {
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
      dateOfEmployment: 'Date of employment is required.',
      dateOfBirth: 'Date of birth is required.',
      phoneNumber: 'Phone number is required.',
      emailAddress: 'Email address is required.',
    });
  });

  test('checks for duplicate phone number and email', async () => {
    const employee = {
      id: 999,
      dateOfEmployment: '2020-01-15',
      dateOfBirth: '1985-05-20',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
      department: 'analytics',
      position: 'junior',
    };

    await store.dispatch(addEmployee(employee));

    const el = await fixture(html`<employee-form></employee-form>`);

    const {id, ...rest} = employee;

    el.employee = {
      ...rest,
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    el.handleSubmit();

    assert.deepEqual(el.validationErrors, {
      phoneNumber: 'Phone number must be unique.',
      emailAddress: 'Email address must be unique.',
    });
  });

  test('submits valid form', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = {
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567891',
      emailAddress: 'alice.smith@example.com',
      department: 'tech',
      position: 'senior',
    };

    let formSubmitted = false;
    el.addEventListener('form-submit', (e) => {
      formSubmitted = true;
      assert.deepEqual(e.detail.employee, el.employee);
    });

    el.handleSubmit();
    assert.isTrue(formSubmitted, 'The form-submit event should be fired.');
  });

  test('renders with provided employee data', async () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
      department: 'tech',
      position: 'junior',
    };
    const el = await fixture(
      html`<employee-form .employee="${employee}"></employee-form>`
    );
    const firstNameInput = el.shadowRoot.querySelector(
      'text-input[name="firstName"]'
    );
    assert.equal(firstNameInput.value, 'John');
  });

  test('updates button label based on mode', async () => {
    const el = await fixture(html`<employee-form mode="edit"></employee-form>`);
    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.textContent.trim(), 'Save');
  });
});
