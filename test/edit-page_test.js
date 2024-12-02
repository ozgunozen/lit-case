import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import '../src/pages/edit-page.js';
import store from '../src/store/index.js';
import {updateEmployee} from '../src/store/reducers/employeesReducer.js';
import {showToast} from '../src/store/reducers/appReducer.js';
import {Router} from '@vaadin/router';

suite('EditPage', () => {
  let getStateStub;
  let dispatchSpy;
  let routerSpy;

  setup(() => {
    getStateStub = sinon.stub(store, 'getState').returns({
      employees: [
        {id: '1', firstName: 'John', lastName: 'Doe', department: 'Tech'},
      ],
    });

    dispatchSpy = sinon.spy(store, 'dispatch');
    routerSpy = sinon.spy(Router, 'go');
  });

  teardown(() => {
    getStateStub.restore();
    dispatchSpy.restore();
    routerSpy.restore();
  });

  test('is defined', () => {
    const el = document.createElement('edit-page');
    assert.instanceOf(el, customElements.get('edit-page'));
  });

  test('initializes correctly with employee data', async () => {
    const el = await fixture(html`<edit-page></edit-page>`);
    el.id = '1';
    el.connectedCallback();

    assert.deepEqual(
      el.employee,
      {id: '1', firstName: 'John', lastName: 'Doe', department: 'Tech'},
      'Employee data is correctly set from the store'
    );
  });

  test('handles form submission correctly', async () => {
    const el = await fixture(html`<edit-page></edit-page>`);
    el.employee = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Tech',
    };

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    employeeForm.dispatchEvent(
      new CustomEvent('form-submit', {
        detail: {
          employee: {
            id: '1',
            firstName: 'Jane',
            lastName: 'Smith',
            department: 'Analytics',
          },
        },
        bubbles: true,
        composed: true,
      })
    );

    assert.isTrue(
      dispatchSpy.calledWith(
        updateEmployee({
          id: '1',
          firstName: 'Jane',
          lastName: 'Smith',
          department: 'Analytics',
        })
      ),
      'updateEmployee action is dispatched with correct data'
    );
    assert.isTrue(
      dispatchSpy.calledWith(
        showToast({message: 'Employee Jane Smith updated!'})
      ),
      'showToast action is dispatched with the correct message'
    );
    assert.isTrue(
      routerSpy.calledWith('/'),
      'Router navigates to the home page'
    );
  });
});
