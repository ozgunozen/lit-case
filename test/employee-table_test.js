import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import {EmployeeTable} from '../src/components/employee-table.js';
import store from '../src/store/index.js';
import {showToast} from '../src/store/reducers/appReducer';

suite('EmployeeTable', () => {
  const employees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2022-01-15',
      dateOfBirth: '1990-06-12',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
      department: 'tech',
      position: 'senior',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfEmployment: '2021-08-10',
      dateOfBirth: '1985-04-23',
      phoneNumber: '0987654321',
      emailAddress: 'jane.smith@example.com',
      department: 'analytics',
      position: 'junior',
    },
  ];

  test('is defined', () => {
    const el = document.createElement('employee-table');
    assert.instanceOf(el, EmployeeTable);
  });

  test('renders table with employees', async () => {
    const el = await fixture(
      html`<employee-table .employees="${employees}"></employee-table>`
    );
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(
      rows.length,
      employees.length,
      'Renders the correct number of rows'
    );
    assert.include(
      rows[0].innerHTML,
      'John',
      'First employee is rendered correctly'
    );
    assert.include(
      rows[1].innerHTML,
      'Jane',
      'Second employee is rendered correctly'
    );
  });

  test('dispatches sort event', async () => {
    const el = await fixture(
      html`<employee-table .employees="${employees}"></employee-table>`
    );
    const spy = sinon.spy(el, 'dispatchSort');
    const firstNameHeader = el.shadowRoot.querySelector('th:nth-child(2)');
    firstNameHeader.click();

    assert.isTrue(spy.calledOnce, 'dispatchSort is called');
    assert.deepEqual(
      spy.getCall(0).args[0],
      'firstName',
      'Correct column is sorted'
    );
  });

  test('dispatches edit event', async () => {
    const el = await fixture(
      html`<employee-table .employees="${employees}"></employee-table>`
    );
    const spy = sinon.spy(el, 'dispatchEdit');
    const editButton = el.shadowRoot.querySelector('button.action-button');

    editButton.click();
    assert.isTrue(spy.calledOnce, 'dispatchEdit is called');
    assert.equal(
      spy.getCall(0).args[0],
      employees[0].id,
      'Correct employee ID is passed'
    );
  });

  test('opens and closes modal', async () => {
    const el = await fixture(
      html`<employee-table .employees="${employees}"></employee-table>`
    );
    el.openModal(employees[0].id);
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('confirmation-modal');
    assert.isTrue(modal.isOpen, 'Modal opens');
    assert.equal(
      el.selectedEmployeeId,
      employees[0].id,
      'Selected employee ID is set'
    );

    modal.dispatchEvent(new Event('close-modal'));
    await el.updateComplete;
    assert.isFalse(modal.isOpen, 'Modal closes');
  });

  test('dispatches confirm-delete and toast actions', async () => {
    const el = await fixture(
      html`<employee-table .employees="${employees}"></employee-table>`
    );
    const deleteSpy = sinon.spy();
    el.addEventListener('delete', deleteSpy);

    const toastSpy = sinon.spy(store, 'dispatch');

    el.openModal(employees[0].id);
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('confirmation-modal');
    modal.dispatchEvent(new Event('confirm-action'));
    await el.updateComplete;

    assert.isTrue(deleteSpy.calledOnce, 'Delete event is dispatched');
    assert.equal(
      deleteSpy.getCall(0).args[0].detail.id,
      employees[0].id,
      'Correct employee ID is passed in delete event'
    );

    assert.isTrue(
      toastSpy.calledWith(
        showToast({message: 'Employee John Doe deleted successfully!'})
      ),
      'Toast action is dispatched'
    );

    toastSpy.restore();
  });

  test('does not render table rows when employees list is empty', async () => {
    const el = await fixture(html`<employee-table .employees="${[]}" />`);
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 0, 'No rows are rendered');
  });
});
