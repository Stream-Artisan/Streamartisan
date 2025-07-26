class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Global error handling
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    
    // Network error monitoring
    this.monitorNetworkErrors();
  }

  handleError(event) {
    console.error('Global error:', event.error);
    this.logError({
      type: 'javascript',
      message: event.error.message,
      stack: event.error.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }

  handlePromiseRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    this.logError({
      type: 'promise',
      message: event.reason.message || event.reason,
      stack: event.reason.stack
    });
  }

  monitorNetworkErrors() {
    // Monitor failed resource loads
    document.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logError({
          type: 'resource',
          message: `Failed to load: ${event.target.src || event.target.href}`,
          element: event.target.tagName
        });
      }
    }, true);
  }

  logError(errorData) {
    // Send to analytics or error tracking service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: errorData.message,
        fatal: false
      });
    }

    // Store locally for debugging
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push({
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('app_errors', JSON.stringify(errors));
  }

  getStoredErrors() {
    return JSON.parse(localStorage.getItem('app_errors') || '[]');
  }

  clearStoredErrors() {
    localStorage.removeItem('app_errors');
  }
}

// Initialize error handler
new ErrorHandler();