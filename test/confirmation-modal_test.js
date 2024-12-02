import {html, fixture, assert} from '@open-wc/testing';
import {ConfirmationModal} from './../src/components/confirmation-modal.js';

suite('ConfirmationModal', () => {
  test('is defined', () => {
    const el = document.createElement('confirmation-modal');
    assert.instanceOf(el, ConfirmationModal);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<confirmation-modal></confirmation-modal>`);
    assert.equal(el.isOpen, false, 'Modal is closed by default');
    assert.equal(el.message, '', 'Default message is an empty string');
    assert.isNull(
      el.shadowRoot.querySelector('.modal'),
      'Modal content is not rendered when closed'
    );
  });

  test('renders when isOpen is true', async () => {
    const el = await fixture(
      html`<confirmation-modal .isOpen=${true}></confirmation-modal>`
    );
    const modal = el.shadowRoot.querySelector('.modal');
    assert.ok(modal, 'Modal content is rendered when isOpen is true');
    assert.equal(
      modal.querySelector('h2').textContent.trim(),
      'Are you sure?',
      'Default message is displayed'
    );
  });

  test('displays a custom message', async () => {
    const el = await fixture(
      html`<confirmation-modal
        .isOpen=${true}
        message="Delete this item?"
      ></confirmation-modal>`
    );
    const modal = el.shadowRoot.querySelector('.modal');
    assert.ok(modal, 'Modal content is rendered');
    assert.equal(
      modal.querySelector('h2').textContent.trim(),
      'Delete this item?',
      'Custom message is displayed'
    );
  });

  test('dispatches close-modal event on Cancel button click', async () => {
    const el = await fixture(
      html`<confirmation-modal .isOpen=${true}></confirmation-modal>`
    );
    const cancelButton = el.shadowRoot.querySelector('button.cancel');
    let eventFired = false;

    el.addEventListener('close-modal', () => {
      eventFired = true;
    });

    cancelButton.click();
    assert.isFalse(el.isOpen, 'Modal is closed after Cancel button click');
    assert.isTrue(eventFired, 'close-modal event is dispatched');
  });

  test('dispatches confirm-action event on Confirm button click', async () => {
    const el = await fixture(
      html`<confirmation-modal .isOpen=${true}></confirmation-modal>`
    );
    const confirmButton = el.shadowRoot.querySelector('button.confirm');
    let eventFired = false;

    el.addEventListener('confirm-action', () => {
      eventFired = true;
    });

    confirmButton.click();
    assert.isFalse(el.isOpen, 'Modal is closed after Confirm button click');
    assert.isTrue(eventFired, 'confirm-action event is dispatched');
  });

  test('does not render modal content when isOpen is false', async () => {
    const el = await fixture(
      html`<confirmation-modal .isOpen=${false}></confirmation-modal>`
    );
    const modal = el.shadowRoot.querySelector('.modal');
    assert.isNull(modal, 'Modal content is not rendered when isOpen is false');
  });

  test('handles quick toggle of isOpen', async () => {
    const el = await fixture(
      html`<confirmation-modal .isOpen=${false}></confirmation-modal>`
    );
    el.isOpen = true;
    await el.updateComplete;

    assert.ok(
      el.shadowRoot.querySelector('.modal'),
      'Modal content is rendered when isOpen is true'
    );

    el.isOpen = false;
    await el.updateComplete;

    assert.isNull(
      el.shadowRoot.querySelector('.modal'),
      'Modal content is removed when isOpen is false'
    );
  });
});
