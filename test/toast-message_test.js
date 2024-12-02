import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import {ToastMessage} from '../src/components/toast-message.js';
import store from '../src/store/index.js';
import {showToast, hideToast} from '../src/store/reducers/appReducer.js';

suite('ToastMessage', () => {
  let dispatchSpy;

  setup(() => {
    dispatchSpy = sinon.spy(store, 'dispatch');
  });

  teardown(() => {
    dispatchSpy.restore();
  });

  test('is defined', () => {
    const el = document.createElement('toast-message');
    assert.instanceOf(el, ToastMessage);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    const toast = el.shadowRoot.querySelector('.toast');

    assert.ok(toast, 'Toast element is rendered');
    assert.equal(el.message, '', 'Default message is an empty string');
    assert.isFalse(el.isVisible, 'Toast is not visible by default');
    assert.isFalse(
      toast.classList.contains('show'),
      'Toast does not have the show class by default'
    );
  });

  test('renders toast message when visible', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);

    // Simulate state change
    store.dispatch(showToast({message: 'Test Message', isVisible: true}));
    await el.updateComplete;

    const toast = el.shadowRoot.querySelector('.toast');

    assert.equal(
      el.message,
      'Test Message',
      'Message is updated correctly from the store'
    );
    assert.isTrue(el.isVisible, 'isVisible is true');
    assert.isTrue(
      toast.classList.contains('show'),
      'Toast has the show class when visible'
    );
    assert.include(
      toast.textContent.trim(),
      'Test Message',
      'Toast displays the correct message'
    );
  });

  test('hides the toast after 3 seconds', async () => {
    const clock = sinon.useFakeTimers();
    const el = await fixture(html`<toast-message></toast-message>`);

    // Simulate state change
    store.dispatch(showToast({message: 'Auto Hide Test', isVisible: true}));
    await el.updateComplete;

    assert.isTrue(el.isVisible, 'Toast is visible');

    clock.tick(3000); // Fast-forward 3 seconds
    await el.updateComplete;

    assert.isFalse(el.isVisible, 'Toast is hidden after 3 seconds');
    assert.isTrue(
      dispatchSpy.calledWith(hideToast()),
      'hideToast action is dispatched'
    );

    clock.restore();
  });

  test('updates correctly when the store state changes', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);

    // First state change
    store.dispatch(showToast({message: 'First Message', isVisible: true}));
    await el.updateComplete;

    assert.equal(el.message, 'First Message', 'Message updates to first state');
    assert.isTrue(el.isVisible, 'isVisible updates to first state');

    // Second state change
    store.dispatch(showToast({message: 'Second Message', isVisible: true}));
    await el.updateComplete;

    assert.equal(
      el.message,
      'Second Message',
      'Message updates to second state'
    );
    assert.isTrue(el.isVisible, 'isVisible updates to second state');
  });

  test('cleans up subscription on disconnection', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    const unsubscribeSpy = sinon.spy(el, 'unsubscribe');

    el.remove();

    assert.isTrue(
      unsubscribeSpy.calledOnce,
      'Unsubscribe is called on removal'
    );
  });
});
