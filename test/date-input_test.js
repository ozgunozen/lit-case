import {DateInput} from './../src/components/date-input.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('date-input', () => {
  test('is defined', () => {
    const el = document.createElement('date-input');
    assert.instanceOf(el, DateInput);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<date-input></date-input>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="input-container">
        <label for=""></label>
        <input type="date" id="" name="" class="">
        <!---->
      </div>
    `
    );
  });

  test('renders with provided properties', async () => {
    const el = await fixture(
      html`<date-input
        label="Select a date"
        name="date"
        value="2023-12-01"
      ></date-input>`
    );
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.value, '2023-12-01');
    assert.shadowDom.equal(
      el,
      `
      <div class="input-container">
        <label for="date">Select a date</label>
        <input type="date" id="date" name="date" class="">
        <!---->
      </div>
    `
    );
  });

  test('emits an input-change event on input', async () => {
    const el = await fixture(
      html`<date-input name="date" value="2023-12-01"></date-input>`
    );
    const input = el.shadowRoot.querySelector('input');

    let eventFired = false;
    el.addEventListener('input-change', (e) => {
      eventFired = true;
      assert.equal(e.detail.name, 'date');
      assert.equal(e.detail.value, '2023-12-02');
    });

    input.value = '2023-12-02';
    input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));

    assert.isTrue(eventFired, 'The input-change event should be fired.');
  });

  test('renders error message when error property is set', async () => {
    const el = await fixture(
      html`<date-input
        label="Select a date"
        name="date"
        error="This field is required"
      ></date-input>`
    );
    const errorMessage = el.shadowRoot.querySelector('.error-message');
    assert.equal(errorMessage.textContent.trim(), 'This field is required');
  });

  test('applies error styling when error property is set', async () => {
    const el = await fixture(
      html`<date-input name="date" error="This field is required"></date-input>`
    );
    const input = el.shadowRoot.querySelector('input');
    assert.isTrue(
      input.classList.contains('error'),
      'The input should have the "error" class applied.'
    );
  });

  test('styling applied', async () => {
    const el = await fixture(
      html`<date-input label="Select a date"></date-input>`
    );
    const input = el.shadowRoot.querySelector('input');
    const computedStyles = getComputedStyle(input);
    assert.equal(computedStyles.borderRadius, '6px');
    assert.equal(computedStyles.borderColor, 'rgb(204, 204, 204)');
  });
});
