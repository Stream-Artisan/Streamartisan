class ContactFormHandler {
  constructor() {
    this.forms = document.querySelectorAll('form[data-contact]');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = new FormData(form);
      
      // Add CSRF token
      if (!formData.has('csrf_token')) {
        formData.append('csrf_token', await this.getCSRFToken());
      }

      const response = await fetch(form.action || '/send_email.php', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        this.showSuccess('Message sent successfully!');
        form.reset();
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'contact_form'
          });
        }
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Failed to send message. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async getCSRFToken() {
    try {
      const response = await fetch('/api/csrf-token.php');
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      return '';
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactFormHandler();
});