import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import '../src/pages/create-page.js';
import store from '../src/store/index.js';
import {addEmployee} from '../src/store/reducers/employeesReducer.js';
import {showToast} from '../src/store/reducers/appReducer.js';
import {Router} from '@vaadin/router';

suite('CreatePage', () => {
  let dispatchSpy;
  let routerSpy;

  setup(() => {
    dispatchSpy = sinon.spy(store, 'dispatch');
    routerSpy = sinon.spy(Router, 'go');
  });

  teardown(() => {
    dispatchSpy.restore();
    routerSpy.restore();
  });

  test('is defined', () => {
    const el = document.createElement('create-page');
    assert.instanceOf(el, customElements.get('create-page'));
  });

  test('renders with required components', async () => {
    const el = await fixture(html`<create-page></create-page>`);
    const layout = el.shadowRoot.querySelector('layout-component');
    const form = el.shadowRoot.querySelector('employee-form');

    assert.ok(layout, 'Layout component is rendered');
    assert.ok(form, 'Employee form is rendered');
  });

  test('dispatches addEmployee action on form submission', async () => {
    const el = await fixture(html`<create-page></create-page>`);
    const form = el.shadowRoot.querySelector('employee-form');

    const mockEmployee = {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfEmployment: '2022-01-15',
      dateOfBirth: '1990-06-12',
      phoneNumber: '1234567890',
      emailAddress: 'jane.doe@example.com',
      department: 'tech',
      position: 'senior',
    };

    form.dispatchEvent(
      new CustomEvent('form-submit', {
        detail: {employee: mockEmployee},
        bubbles: true,
        composed: true,
      })
    );

    assert.isTrue(
      dispatchSpy.calledWith(addEmployee(mockEmployee)),
      'addEmployee action is dispatched with correct payload'
    );
  });

  test('dispatches showToast action on form submission', async () => {
    const el = await fixture(html`<create-page></create-page>`);
    const form = el.shadowRoot.querySelector('employee-form');

    const mockEmployee = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    form.dispatchEvent(
      new CustomEvent('form-submit', {
        detail: {employee: mockEmployee},
        bubbles: true,
        composed: true,
      })
    );

    assert.isTrue(
      dispatchSpy.calledWith(
        showToast({message: `Employee Jane Doe created!`})
      ),
      'showToast action is dispatched with correct message'
    );
  });

  test('navigates to home page on form submission', async () => {
    const el = await fixture(html`<create-page></create-page>`);
    const form = el.shadowRoot.querySelector('employee-form');

    const mockEmployee = {firstName: 'Jane', lastName: 'Doe'};

    form.dispatchEvent(
      new CustomEvent('form-submit', {
        detail: {employee: mockEmployee},
        bubbles: true,
        composed: true,
      })
    );

    assert.isTrue(routerSpy.calledOnce, 'Router.go is called');
    assert.isTrue(routerSpy.calledWith('/'), 'Navigates to the home page');
  });
});
