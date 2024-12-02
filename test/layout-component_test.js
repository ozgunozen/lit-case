import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import {LayoutComponent} from '../src/components/layout-component';
import {Router} from '@vaadin/router';

suite('LayoutComponent', () => {
  let routerStub;

  setup(() => {
    routerStub = sinon.stub(Router, 'go');
  });

  teardown(() => {
    routerStub.restore();
  });

  test('is defined', () => {
    const el = document.createElement('layout-component');
    assert.instanceOf(el, LayoutComponent);
  });

  test('renders with default structure', async () => {
    const el = await fixture(html`<layout-component></layout-component>`);
    const header = el.shadowRoot.querySelector('header');
    const main = el.shadowRoot.querySelector('main');
    const logo = el.shadowRoot.querySelector('.logo');
    const createButton = el.shadowRoot.querySelector('.create-button');
    const languageSwitcher = el.shadowRoot.querySelector('language-switcher');
    const toastMessage = el.shadowRoot.querySelector('toast-message');

    assert.ok(header, 'Header is rendered');
    assert.ok(main, 'Main section is rendered');
    assert.ok(logo, 'Logo is rendered');
    assert.ok(createButton, 'Create button is rendered');
    assert.ok(languageSwitcher, 'Language switcher is rendered');
    assert.ok(toastMessage, 'Toast message is rendered');
  });

  test('handles logo click to navigate to "/"', async () => {
    const el = await fixture(html`<layout-component></layout-component>`);
    const logo = el.shadowRoot.querySelector('.logo');

    logo.click();
    assert.isTrue(routerStub.calledOnce, 'Router.go is called');
    assert.isTrue(routerStub.calledWith('/'), 'Navigates to "/"');
  });

  test('handles create button click to navigate to "/create"', async () => {
    const el = await fixture(html`<layout-component></layout-component>`);
    const createButton = el.shadowRoot.querySelector('.create-button');

    createButton.click();
    assert.isTrue(routerStub.calledOnce, 'Router.go is called');
    assert.isTrue(routerStub.calledWith('/create'), 'Navigates to "/create"');
  });

  test('slots content into the main section', async () => {
    const el = await fixture(
      html`<layout-component><p>Test Content</p></layout-component>`
    );
    const mainContent = el.shadowRoot.querySelector('main').innerHTML.trim();

    assert.include(
      mainContent,
      '<slot></slot>',
      'Main section contains the slot'
    );
  });

  test('renders slot content correctly', async () => {
    const el = await fixture(
      html`<layout-component><p>Test Content</p></layout-component>`
    );
    const slottedContent = el.querySelector('p');

    assert.ok(slottedContent, 'Slot content is rendered');
    assert.equal(
      slottedContent.textContent.trim(),
      'Test Content',
      'Slot content is displayed correctly'
    );
  });

  test('language switcher is present', async () => {
    const el = await fixture(html`<layout-component></layout-component>`);
    const languageSwitcher = el.shadowRoot.querySelector('language-switcher');
    assert.ok(languageSwitcher, 'Language switcher is rendered');
  });

  test('toast message is present', async () => {
    const el = await fixture(html`<layout-component></layout-component>`);
    const toastMessage = el.shadowRoot.querySelector('toast-message');
    assert.ok(toastMessage, 'Toast message is rendered');
  });
});
