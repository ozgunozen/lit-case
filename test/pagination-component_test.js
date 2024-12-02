import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import {PaginationComponent} from '../src/components/pagination-component';

suite('PaginationComponent', () => {
  test('is defined', () => {
    const el = document.createElement('pagination-component');
    assert.instanceOf(el, PaginationComponent);
  });

  test('renders with default properties', async () => {
    const el = await fixture(
      html`<pagination-component></pagination-component>`
    );
    const buttons = el.shadowRoot.querySelectorAll('button');

    assert.equal(el.currentPage, 1, 'Default current page is 1');
    assert.equal(el.totalPages, 1, 'Default total pages is 1');
    assert.equal(
      buttons.length,
      3,
      'Renders 3 buttons (previous, next, and current page)'
    );
  });

  test('renders correct number of page buttons based on totalPages and maxVisiblePages', async () => {
    const el = await fixture(
      html`<pagination-component
        .totalPages=${10}
        .currentPage=${5}
        .maxVisiblePages=${5}
      ></pagination-component>`
    );

    const buttons = el.shadowRoot.querySelectorAll(
      'button:not(.previous-next)'
    );
    assert.equal(
      buttons.length,
      5,
      'Renders 5 page buttons based on maxVisiblePages'
    );
    assert.equal(
      buttons[0].textContent.trim(),
      '3',
      'First visible page is correct'
    );
    assert.equal(
      buttons[4].textContent.trim(),
      '7',
      'Last visible page is correct'
    );
  });

  test('disables the previous button on the first page', async () => {
    const el = await fixture(
      html`<pagination-component
        .currentPage=${1}
        .totalPages=${5}
      ></pagination-component>`
    );
    const prevButton = el.shadowRoot.querySelector(
      '.previous-next:first-of-type'
    );

    assert.isTrue(
      prevButton.disabled,
      'Previous button is disabled on the first page'
    );
  });

  test('disables the next button on the last page', async () => {
    const el = await fixture(
      html`<pagination-component
        .currentPage=${5}
        .totalPages=${5}
      ></pagination-component>`
    );
    const nextButton = el.shadowRoot.querySelector(
      '.previous-next:last-of-type'
    );

    assert.isTrue(
      nextButton.disabled,
      'Next button is disabled on the last page'
    );
  });

  test('dispatches page-change event when a page button is clicked', async () => {
    const el = await fixture(
      html`<pagination-component
        .totalPages=${5}
        .currentPage=${2}
      ></pagination-component>`
    );
    const pageButton = el.shadowRoot.querySelector('button:nth-of-type(2)');
    const spy = sinon.spy();

    el.addEventListener('page-change', spy);
    pageButton.click();

    assert.isTrue(spy.calledOnce, 'page-change event is dispatched');
    assert.equal(
      spy.getCall(0).args[0].detail.page,
      1,
      'Event detail contains the correct page number'
    );
  });

  test('dispatches page-change event when the next button is clicked', async () => {
    const el = await fixture(
      html`<pagination-component
        .currentPage=${1}
        .totalPages=${5}
      ></pagination-component>`
    );
    const nextButton = el.shadowRoot.querySelector(
      '.previous-next:last-of-type'
    );
    const spy = sinon.spy();

    el.addEventListener('page-change', spy);
    nextButton.click();

    assert.isTrue(spy.calledOnce, 'page-change event is dispatched');
    assert.equal(
      spy.getCall(0).args[0].detail.page,
      2,
      'Event detail contains the correct page number'
    );
  });

  test('dispatches page-change event when the previous button is clicked', async () => {
    const el = await fixture(
      html`<pagination-component
        .currentPage=${3}
        .totalPages=${5}
      ></pagination-component>`
    );
    const prevButton = el.shadowRoot.querySelector(
      '.previous-next:first-of-type'
    );
    const spy = sinon.spy();

    el.addEventListener('page-change', spy);
    prevButton.click();

    assert.isTrue(spy.calledOnce, 'page-change event is dispatched');
    assert.equal(
      spy.getCall(0).args[0].detail.page,
      2,
      'Event detail contains the correct page number'
    );
  });

  test('does not dispatch page-change event when clicking on the disabled previous button', async () => {
    const el = await fixture(
      html`<pagination-component
        .currentPage=${1}
        .totalPages=${5}
      ></pagination-component>`
    );
    const prevButton = el.shadowRoot.querySelector(
      '.previous-next:first-of-type'
    );
    const spy = sinon.spy();

    el.addEventListener('page-change', spy);
    prevButton.click();

    assert.isFalse(
      spy.called,
      'No event is dispatched when clicking on a disabled button'
    );
  });

  test('highlights the active page button', async () => {
    const el = await fixture(
      html`<pagination-component
        .currentPage=${3}
        .totalPages=${5}
      ></pagination-component>`
    );
    const activeButton = el.shadowRoot.querySelector('button.active');

    assert.equal(
      activeButton.textContent.trim(),
      '3',
      'The active page button is highlighted'
    );
  });
});
