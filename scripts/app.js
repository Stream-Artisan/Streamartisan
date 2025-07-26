// Main application controller
class StreamArtisanApp {
  constructor() {
    this.modules = new Map();
    this.isInitialized = false;
  }

  registerModule(name, module) {
    this.modules.set(name, module);
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Initialize core modules
      await this.initializeModules();
      this.setupGlobalHandlers();
      this.isInitialized = true;
      console.log('StreamArtisan App initialized successfully');
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  }

  async initializeModules() {
    const initPromises = Array.from(this.modules.values())
      .filter(module => typeof module.init === 'function')
      .map(module => module.init());

    await Promise.all(initPromises);
  }

  setupGlobalHandlers() {
    // Unified navigation handler
    this.setupNavigation();
    // Unified form handler
    this.setupForms();
    // Unified popup handler
    this.setupPopups();
  }

  setupNavigation() {
    // Mobile nav toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('#mobile-nav');
    
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
    }
  }

  setupForms() {
    // Unified form submission
    document.querySelectorAll('form[data-ajax]').forEach(form => {
      form.addEventListener('submit', this.handleFormSubmission.bind(this));
    });
  }

  async handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        this.showNotification('Message sent successfully!', 'success');
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    }
  }

  setupPopups() {
    // Unified popup system
    window.openPopup = (popupId) => {
      const popup = document.getElementById(popupId);
      if (popup) popup.classList.add('active');
    };

    window.closePopup = (popupId) => {
      const popup = document.getElementById(popupId);
      if (popup) popup.classList.remove('active');
    };
  }

  showNotification(message, type = 'info') {
    // Create notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new StreamArtisanApp();
  window.app.init();
});