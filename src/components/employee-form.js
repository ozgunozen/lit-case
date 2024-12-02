import {html, LitElement} from 'lit';
import {z} from 'zod';
import store from '../store/index.js';
import {selectAllEmployees} from '../store/selectors.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employee: {type: Object},
    mode: {type: String},
    validationErrors: {type: Object},
  };

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailAddress: '',
      department: 'analytics',
      position: 'junior',
    };
    this.mode = 'create';
    this.validationErrors = {};
  }

  employeeSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    dateOfEmployment: z.string().min(1, 'Date of employment is required.'),
    dateOfBirth: z.string().min(1, 'Date of birth is required.'),
    phoneNumber: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be 10 digits.')
      .min(1, 'Phone number is required.'),
    emailAddress: z
      .string()
      .email('Invalid email address.')
      .min(1, 'Email address is required.'),
    department: z.enum(['analytics', 'tech'], {
      errorMap: () => ({message: 'Invalid department.'}),
    }),
    position: z.enum(['junior', 'medior', 'senior'], {
      errorMap: () => ({message: 'Invalid position.'}),
    }),
  });

  validateForm() {
    try {
      this.employeeSchema.parse(this.employee);
      this.validationErrors = {};
      const employees = selectAllEmployees(store.getState());
      const isDuplicatePhoneNumber = employees.some(
        (emp) =>
          emp.phoneNumber === this.employee.phoneNumber &&
          (this.mode === 'create' || emp.id !== this.employee.id)
      );
      const isDuplicateEmail = employees.some(
        (emp) =>
          emp.emailAddress === this.employee.emailAddress &&
          (this.mode === 'create' || emp.id !== this.employee.id)
      );

      if (isDuplicatePhoneNumber || isDuplicateEmail) {
        if (isDuplicatePhoneNumber) {
          this.validationErrors.phoneNumber = 'Phone number must be unique.';
        }

        if (isDuplicateEmail) {
          this.validationErrors.emailAddress = 'Email address must be unique.';
        }

        throw new Error('Duplicate record.');
      }

      this.validationErrors = {};
      return true;
    } catch (error) {
      if (error.errors) {
        this.validationErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
      }
      return false;
    }
  }

  handleInputChange(e) {
    const {name, value} = e.detail;
    this.employee = {...this.employee, [name]: value};
  }

  handleSubmit() {
    const isValid = this.validateForm();
    if (isValid) {
      this.dispatchEvent(
        new CustomEvent('form-submit', {
          detail: {employee: this.employee},
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    const departments = ['analytics', 'tech'];
    const positions = ['junior', 'medior', 'senior'];

    return html`
      <form>
        <text-input
          label="First Name"
          name="firstName"
          .value="${this.employee.firstName}"
          .error="${this.validationErrors.firstName || ''}"
          @input-change="${this.handleInputChange}"
        ></text-input>
        <text-input
          label="Last Name"
          name="lastName"
          .value="${this.employee.lastName}"
          .error="${this.validationErrors.lastName || ''}"
          @input-change="${this.handleInputChange}"
        ></text-input>
        <date-input
          label="Date of Employment"
          name="dateOfEmployment"
          .value="${this.employee.dateOfEmployment}"
          .error="${this.validationErrors.dateOfEmployment || ''}"
          @input-change="${this.handleInputChange}"
        ></date-input>
        <date-input
          label="Date of Birth"
          name="dateOfBirth"
          .value="${this.employee.dateOfBirth}"
          .error="${this.validationErrors.dateOfBirth || ''}"
          @input-change="${this.handleInputChange}"
        ></date-input>
        <text-input
          label="Phone Number"
          name="phoneNumber"
          .value="${this.employee.phoneNumber}"
          .error="${this.validationErrors.phoneNumber || ''}"
          @input-change="${this.handleInputChange}"
        ></text-input>
        <text-input
          label="Email Address"
          name="emailAddress"
          .value="${this.employee.emailAddress}"
          .error="${this.validationErrors.emailAddress || ''}"
          @input-change="${this.handleInputChange}"
        ></text-input>
        <select-input
          label="Department"
          name="department"
          .value="${this.employee.department}"
          .options="${departments}"
          @input-change="${this.handleInputChange}"
        ></select-input>
        <select-input
          label="Position"
          name="position"
          .value="${this.employee.position}"
          .options="${positions}"
          @input-change="${this.handleInputChange}"
        ></select-input>
        <button type="button" @click="${this.handleSubmit}">
          ${this.mode === 'create' ? 'Create' : 'Save'}
        </button>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
