import {html, fixture, assert} from '@open-wc/testing';
import sinon from 'sinon';
import {SelectInput} from '../src/components/select-input';

suite('SelectInput', () => {
  test('is defined', () => {
    const el = document.createElement('select-input');
    assert.instanceOf(el, SelectInput);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<select-input></select-input>`);
    const label = el.shadowRoot.querySelector('label');
    const select = el.shadowRoot.querySelector('select');
    const errorMessage = el.shadowRoot.querySelector('.error-message');

    assert.ok(label, 'Label is rendered');
    assert.ok(select, 'Select dropdown is rendered');
    assert.isNull(errorMessage, 'No error message is rendered by default');
  });

  test('renders options correctly', async () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const el = await fixture(
      html`<select-input .options=${options}></select-input>`
    );
    const renderedOptions = el.shadowRoot.querySelectorAll('option');

    assert.equal(
      renderedOptions.length,
      options.length + 1,
      'Correct number of options are rendered'
    );
    assert.equal(
      renderedOptions[1].value,
      'Option 1',
      'First option value is correct'
    );
    assert.equal(
      renderedOptions[1].textContent.trim(),
      'Option 1',
      'First option text is correct'
    );
  });

  test('displays the label', async () => {
    const el = await fixture(
      html`<select-input label="Test Label"></select-input>`
    );
    const label = el.shadowRoot.querySelector('label');
    assert.equal(
      label.textContent.trim(),
      'Test Label',
      'Label text is rendered correctly'
    );
  });

  test('sets the value correctly', async () => {
    const options = ['Option 1', 'Option 2'];
    const el = await fixture(html`
      <select-input .options=${options} value="Option 2"></select-input>
    `);
    const select = el.shadowRoot.querySelector('select');

    assert.equal(
      select.value,
      'Option 2',
      'The selected value is set correctly'
    );
  });

  test('renders an error message when provided', async () => {
    const el = await fixture(
      html`<select-input error="This is an error"></select-input>`
    );
    const errorMessage = el.shadowRoot.querySelector('.error-message');

    assert.ok(errorMessage, 'Error message is rendered');
    assert.equal(
      errorMessage.textContent.trim(),
      'This is an error',
      'Error message is displayed correctly'
    );
  });

  test('adds the error class to select when an error is provided', async () => {
    const el = await fixture(
      html`<select-input error="This is an error"></select-input>`
    );
    const select = el.shadowRoot.querySelector('select');

    assert.isTrue(
      select.classList.contains('error'),
      'Select element has the error class'
    );
  });

  test('dispatches input-change event on selection change', async () => {
    const options = ['Option 1', 'Option 2'];
    const el = await fixture(
      html`<select-input .options=${options} name="test"></select-input>`
    );
    const select = el.shadowRoot.querySelector('select');
    const spy = sinon.spy();

    el.addEventListener('input-change', spy);

    select.value = 'Option 1';
    select.dispatchEvent(new Event('change'));

    assert.isTrue(spy.calledOnce, 'input-change event is dispatched');
    assert.deepEqual(
      spy.getCall(0).args[0].detail,
      {name: 'test', value: 'Option 1'},
      'Event detail contains the correct name and value'
    );
  });

  test('renders default option as disabled and selected', async () => {
    const el = await fixture(html`<select-input></select-input>`);
    const defaultOption = el.shadowRoot.querySelector('option[value=""]');

    assert.ok(defaultOption, 'Default option is rendered');
    assert.isTrue(defaultOption.disabled, 'Default option is disabled');
    assert.isTrue(defaultOption.selected, 'Default option is selected');
  });
});
