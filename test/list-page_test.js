import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import '../src/pages/list-page.js'; // Adjust the path to your ListPage component
import store from '../src/store/index.js';
import {setViewMode} from '../src/store/reducers/appReducer';

suite('ListPage', () => {
  let dispatchSpy;

  setup(() => {
    // Spy on Redux store.dispatch
    dispatchSpy = sinon.spy(store, 'dispatch');
  });

  teardown(() => {
    dispatchSpy.restore();
  });

  test('is defined', () => {
    const el = document.createElement('list-page');
    assert.instanceOf(el, customElements.get('list-page'));
  });

  test('renders correctly with initial state', async () => {
    const el = await fixture(html`<list-page></list-page>`);
    const layout = el.shadowRoot.querySelector('layout-component');
    const table = el.shadowRoot.querySelector('employee-table');
    const pagination = el.shadowRoot.querySelector('pagination-component');

    assert.ok(layout, 'Layout component is rendered');
    assert.ok(table, 'Employee table is rendered');
    assert.ok(pagination, 'Pagination component is rendered');
  });

  test('handles view mode change', async () => {
    const el = await fixture(html`<list-page></list-page>`);

    const tableViewButton = el.shadowRoot.querySelector(
      '.view-mode-button:nth-child(2)'
    );
    const gridViewButton = el.shadowRoot.querySelector(
      '.view-mode-button:nth-child(3)'
    );

    // Switch to grid view
    gridViewButton.click();
    assert.isTrue(
      dispatchSpy.calledWith(setViewMode('grid')),
      'setViewMode action is dispatched with "grid"'
    );

    // Switch to table view
    tableViewButton.click();
    assert.isTrue(
      dispatchSpy.calledWith(setViewMode('table')),
      'setViewMode action is dispatched with "table"'
    );
  });
});
