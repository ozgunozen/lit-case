import {html, fixture, assert} from '@open-wc/testing';
import {EmployeeGrid} from '../src/components/employee-grid';

suite('EmployeeGrid', () => {
  test('is defined', () => {
    const el = document.createElement('employee-grid');
    assert.instanceOf(el, EmployeeGrid);
  });

  test('renders an empty grid by default', async () => {
    const el = await fixture(html`<employee-grid></employee-grid>`);
    const grid = el.shadowRoot.querySelector('.employee-grid');
    assert.ok(grid, 'The employee grid is rendered');
    assert.equal(
      grid.children.length,
      0,
      'The grid should have no items when employees is empty'
    );
  });

  test('renders employees correctly', async () => {
    const employees = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        department: 'Tech',
        position: 'Senior Developer',
        emailAddress: 'alice.smith@example.com',
      },
      {
        firstName: 'Bob',
        lastName: 'Brown',
        department: 'Analytics',
        position: 'Data Scientist',
        emailAddress: 'bob.brown@example.com',
      },
    ];

    const el = await fixture(
      html`<employee-grid .employees="${employees}"></employee-grid>`
    );
    const gridItems = el.shadowRoot.querySelectorAll('.employee-grid-item');

    assert.equal(
      gridItems.length,
      employees.length,
      'The grid should render the correct number of employees'
    );

    // Verify content of the first employee
    const firstEmployee = gridItems[0];
    assert.include(
      firstEmployee.innerHTML,
      'Alice',
      'First employee name should be displayed'
    );
    assert.include(
      firstEmployee.innerHTML,
      'Smith',
      'First employee last name should be displayed'
    );
    assert.include(
      firstEmployee.innerHTML,
      'Tech',
      'First employee department should be displayed'
    );
    assert.include(
      firstEmployee.innerHTML,
      'Senior Developer',
      'First employee position should be displayed'
    );
    assert.include(
      firstEmployee.innerHTML,
      'alice.smith@example.com',
      'First employee email should be displayed'
    );
  });

  test('applies styling correctly', async () => {
    const el = await fixture(html`<employee-grid></employee-grid>`);
    const grid = el.shadowRoot.querySelector('.employee-grid');
    const styles = getComputedStyle(grid);

    assert.equal(
      styles.display,
      'grid',
      'The grid should use CSS grid for layout'
    );
    assert.ok(styles.gap, 'The grid should have a gap between items');
  });
});
