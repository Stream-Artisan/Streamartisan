class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = new Map();
    this.init();
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.form.addEventListener('input', this.handleInput.bind(this));
  }

  handleInput(e) {
    const field = e.target;
    this.validateField(field);
    this.updateFieldUI(field);
  }

  validateField(field) {
    const value = field.value.trim();
    const rules = this.getValidationRules(field);
    const errors = [];

    rules.forEach(rule => {
      if (!rule.test(value)) {
        errors.push(rule.message);
      }
    });

    if (errors.length > 0) {
      this.errors.set(field.name, errors);
    } else {
      this.errors.delete(field.name);
    }

    return errors.length === 0;
  }

  getValidationRules(field) {
    const rules = [];
    
    if (field.required) {
      rules.push({
        test: (value) => value.length > 0,
        message: 'This field is required'
      });
    }

    if (field.type === 'email') {
      rules.push({
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
      });
    }

    if (field.minLength) {
      rules.push({
        test: (value) => value.length >= field.minLength,
        message: `Minimum ${field.minLength} characters required`
      });
    }

    return rules;
  }

  updateFieldUI(field) {
    const fieldGroup = field.closest('.form-group');
    const errorElement = fieldGroup?.querySelector('.field-error');
    
    if (this.errors.has(field.name)) {
      field.classList.add('error');
      if (errorElement) {
        errorElement.textContent = this.errors.get(field.name)[0];
        errorElement.style.display = 'block';
      }
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = Array.from(this.form.elements)
      .filter(field => field.name)
      .every(field => this.validateField(field));

    if (!isValid) {
      this.showFormErrors();
      return;
    }

    await this.submitForm();
  }

  showFormErrors() {
    Array.from(this.form.elements)
      .filter(field => field.name)
      .forEach(field => this.updateFieldUI(field));
  }

  async submitForm() {
    const submitBtn = this.form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      const formData = new FormData(this.form);
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        this.showSuccess('Message sent successfully!');
        this.form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      this.showError('Failed to send message. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    // Use global notification system
    if (window.app) {
      window.app.showNotification(message, type);
    }
  }
}

// Initialize forms
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    new FormValidator(form);
  });
});