class NavigationManager {
  constructor() {
    this.desktopNav = document.querySelector('.desktop-navbar');
    this.mobileNav = document.querySelector('.mobile-navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileOverlay = document.querySelector('.mobile-overlay');
    this.mobileCloseBtn = document.querySelector('.mobile-close-btn');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    this.allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    this.lastScrollTop = 0;
    this.isScrolling = false;
    this.isMobileMenuOpen = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollHandler();
    this.setupActiveLinks();
    this.setupResponsiveNavigation();
    this.setupAccessibility();
  }

  setupEventListeners() {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Mobile close button
    if (this.mobileCloseBtn) {
      this.mobileCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMobileMenu();
      });
    }

    // Mobile overlay click to close
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', (e) => {
        if (e.target === this.mobileOverlay) {
          this.closeMobileMenu();
        }
      });
    }

    // Mobile nav links
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Window resize handler
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
  }

  setupScrollHandler() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrolled = scrollTop > 50;
    const isScrollingDown = scrollTop > this.lastScrollTop && scrollTop > 100;

    // Add scrolled class for styling
    if (this.desktopNav) {
      this.desktopNav.classList.toggle('scrolled', isScrolled);
    }
    if (this.mobileNav) {
      this.mobileNav.classList.toggle('scrolled', isScrolled);
    }

    // Hide/show navigation on scroll (only if mobile menu is not open)
    if (!this.isMobileMenuOpen) {
      if (window.innerWidth <= 768) {
        // Mobile: hide on scroll down, show on scroll up
        if (this.mobileNav) {
          if (isScrollingDown) {
            this.mobileNav.classList.add('navbar-hidden');
            this.mobileNav.classList.remove('navbar-visible');
          } else {
            this.mobileNav.classList.remove('navbar-hidden');
            this.mobileNav.classList.add('navbar-visible');
          }
        }
      } else {
        // Desktop: show only at top for index.html, always show for other pages
        if (this.desktopNav) {
          const isHomePage = window.location.pathname === '/' || 
                           window.location.pathname === '/index.html' ||
                           window.location.pathname.endsWith('index.html');
          
          if (isHomePage) {
            // Home page: show only at top
            if (scrollTop === 0) {
              this.desktopNav.style.display = 'flex';
              this.desktopNav.classList.remove('navbar-hidden');
            } else {
              this.desktopNav.style.display = 'none';
            }
          } else {
            // Other pages: always show but with scroll effects
            this.desktopNav.style.display = 'flex';
            if (isScrollingDown) {
              this.desktopNav.classList.add('navbar-hidden');
            } else {
              this.desktopNav.classList.remove('navbar-hidden');
            }
          }
        }
      }
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    if (!this.mobileOverlay || !this.hamburger) return;

    this.isMobileMenuOpen = true;
    this.mobileOverlay.classList.add('active');
    this.hamburger.classList.add('active');
    this.hamburger.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll
    document.body.classList.add('mobile-menu-open');
    
    // Focus management
    const firstLink = this.mobileOverlay.querySelector('.mobile-nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }

    // Trap focus within mobile menu
    this.trapFocus(this.mobileOverlay);
  }

  closeMobileMenu() {
    if (!this.mobileOverlay || !this.hamburger) return;

    this.isMobileMenuOpen = false;
    this.mobileOverlay.classList.remove('active');
    this.hamburger.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.classList.remove('mobile-menu-open');
    
    // Return focus to hamburger button
    this.hamburger.focus();
    
    // Remove focus trap
    this.removeFocusTrap();
  }

  setupActiveLinks() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    this.allNavLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      const linkPage = linkPath.split('/').pop();
      
      // Remove existing active classes
      link.classList.remove('active');
      
      // Add active class to current page
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === '') ||
          linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  setupResponsiveNavigation() {
    this.handleResize();
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile view
      if (this.desktopNav) this.desktopNav.style.display = 'none';
      if (this.mobileNav) this.mobileNav.style.display = 'flex';
    } else {
      // Desktop view
      if (this.mobileNav) this.mobileNav.style.display = 'none';
      if (this.desktopNav) this.desktopNav.style.display = 'flex';
      
      // Close mobile menu if it was open
      if (this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }

  setupAccessibility() {
    // Add ARIA labels and roles
    if (this.hamburger) {
      this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      this.hamburger.setAttribute('aria-expanded', 'false');
    }

    if (this.mobileOverlay) {
      this.mobileOverlay.setAttribute('role', 'dialog');
      this.mobileOverlay.setAttribute('aria-modal', 'true');
      this.mobileOverlay.setAttribute('aria-labelledby', 'mobile-nav-title');
    }
  }

  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    this.focusTrapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', this.focusTrapHandler);
  }

  removeFocusTrap() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public method to refresh navigation state
  refresh() {
    this.setupActiveLinks();
    this.handleResize();
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.navigationManager = new NavigationManager();
});

// Legacy function for backward compatibility
window.toggleMenu = function() {
  if (window.navigationManager) {
    window.navigationManager.toggleMobileMenu();
  }
};