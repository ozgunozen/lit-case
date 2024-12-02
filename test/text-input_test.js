import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import {TextInput} from '../src/components/text-input';

suite('TextInput', () => {
  test('is defined', () => {
    const el = document.createElement('text-input');
    assert.instanceOf(el, TextInput);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<text-input></text-input>`);
    const label = el.shadowRoot.querySelector('label');
    const input = el.shadowRoot.querySelector('input');
    const errorMessage = el.shadowRoot.querySelector('.error-message');

    assert.ok(label, 'Label is rendered');
    assert.ok(input, 'Input field is rendered');
    assert.isNull(errorMessage, 'Error message is not rendered by default');
  });

  test('displays the label', async () => {
    const el = await fixture(
      html`<text-input label="Test Label"></text-input>`
    );
    const label = el.shadowRoot.querySelector('label');
    assert.equal(
      label.textContent.trim(),
      'Test Label',
      'Label text is rendered correctly'
    );
  });

  test('sets the input name and value', async () => {
    const el = await fixture(html`
      <text-input name="username" value="JohnDoe"></text-input>
    `);
    const input = el.shadowRoot.querySelector('input');

    assert.equal(input.name, 'username', 'Input name is set correctly');
    assert.equal(input.value, 'JohnDoe', 'Input value is set correctly');
  });

  test('renders an error message when provided', async () => {
    const el = await fixture(html`
      <text-input error="This is an error"></text-input>
    `);
    const errorMessage = el.shadowRoot.querySelector('.error-message');

    assert.ok(errorMessage, 'Error message is rendered');
    assert.equal(
      errorMessage.textContent.trim(),
      'This is an error',
      'Error message is displayed correctly'
    );
  });

  test('adds the error class to input when an error is provided', async () => {
    const el = await fixture(html`
      <text-input error="This is an error"></text-input>
    `);
    const input = el.shadowRoot.querySelector('input');

    assert.isTrue(
      input.classList.contains('error'),
      'Input field has the error class'
    );
  });

  test('dispatches input-change event on input', async () => {
    const el = await fixture(html`<text-input name="username"></text-input>`);
    const input = el.shadowRoot.querySelector('input');
    const spy = sinon.spy();

    el.addEventListener('input-change', spy);

    input.value = 'NewValue';
    input.dispatchEvent(new Event('input'));

    assert.isTrue(spy.calledOnce, 'input-change event is dispatched');
    assert.deepEqual(
      spy.getCall(0).args[0].detail,
      {name: 'username', value: 'NewValue'},
      'Event detail contains the correct name and value'
    );
  });

  test('handles focus styles with class check', async () => {
    const el = await fixture(html`<text-input></text-input>`);
    const input = el.shadowRoot.querySelector('input');

    input.focus();
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;

    // Verify focus state by class or attribute
    assert.isTrue(input.matches(':focus'), 'Input is focused');
  });

  test('removes error styles when error is cleared', async () => {
    const el = await fixture(html`
      <text-input error="This is an error"></text-input>
    `);

    el.error = '';
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input');
    assert.isFalse(
      input.classList.contains('error'),
      'Input field no longer has the error class'
    );
  });
});
