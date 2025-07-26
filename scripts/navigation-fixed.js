class NavigationManager {
  constructor() {
    this.desktopNav = document.querySelector('.desktop-navbar');
    this.mobileNav = document.querySelector('.mobile-navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileOverlay = document.querySelector('.mobile-overlay');
    this.mobileCloseBtn = document.querySelector('.mobile-close-btn');
    this.lastScrollTop = 0;
    this.isMobileMenuOpen = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.handleResize();
    this.setupScrollEffects();
    
    // Force initial visibility check
    setTimeout(() => {
      this.forceVisibilityCheck();
    }, 100);
  }

  forceVisibilityCheck() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Force mobile navbar to be visible
      if (this.mobileNav) {
        this.mobileNav.style.display = 'flex';
        this.mobileNav.style.visibility = 'visible';
        this.mobileNav.style.opacity = '1';
        this.mobileNav.style.transform = 'translateY(0)';
        this.mobileNav.style.top = '0';
        this.mobileNav.style.position = 'fixed';
        this.mobileNav.style.zIndex = '1000';
      }
      
      // Hide desktop navbar
      if (this.desktopNav) {
        this.desktopNav.style.display = 'none';
      }
    } else {
      // Desktop view
      if (this.desktopNav) {
        this.desktopNav.style.display = 'flex';
        this.desktopNav.style.visibility = 'visible';
        this.desktopNav.style.opacity = '1';
      }
      
      if (this.mobileNav) {
        this.mobileNav.style.display = 'none';
      }
    }
  }

  setupEventListeners() {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Close button
    if (this.mobileCloseBtn) {
      this.mobileCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMobileMenu();
      });
    }

    // Close on overlay click
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', (e) => {
        if (e.target === this.mobileOverlay) {
          this.closeMobileMenu();
        }
      });
    }

    // Window resize
    window.addEventListener('resize', this.throttle(() => {
      this.handleResize();
    }, 250));

    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    if (!this.mobileOverlay) return;
    
    this.isMobileMenuOpen = true;
    this.mobileOverlay.classList.add('active');
    
    if (this.hamburger) {
      this.hamburger.classList.add('active');
      this.hamburger.setAttribute('aria-expanded', 'true');
    }
    
    // Prevent background scrolling
    document.body.classList.add('mobile-menu-open');
    
    // Focus management
    const firstLink = this.mobileOverlay.querySelector('.mobile-nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  closeMobileMenu() {
    if (!this.mobileOverlay) return;
    
    this.isMobileMenuOpen = false;
    this.mobileOverlay.classList.remove('active');
    
    if (this.hamburger) {
      this.hamburger.classList.remove('active');
      this.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    // Restore background scrolling
    document.body.classList.remove('mobile-menu-open');
    
    // Return focus to hamburger
    if (this.hamburger) {
      this.hamburger.focus();
    }
  }

  setupScrollEffects() {
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 16), { passive: true });
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

    // Handle scroll behavior only if mobile menu is not open
    if (!this.isMobileMenuOpen) {
      if (window.innerWidth <= 768) {
        // Mobile: Always keep navbar visible, just change background
        if (this.mobileNav) {
          this.mobileNav.style.transform = 'translateY(0)';
          this.mobileNav.style.display = 'flex';
          this.mobileNav.style.visibility = 'visible';
          this.mobileNav.style.opacity = '1';
        }
      } else {
        // Desktop behavior
        if (this.desktopNav) {
          const isHomePage = window.location.pathname === '/' || 
                           window.location.pathname === '/index.html' ||
                           window.location.pathname.endsWith('index.html');
          
          if (isHomePage) {
            // Home page: show only at top
            if (scrollTop === 0) {
              this.desktopNav.style.display = 'flex';
              this.desktopNav.style.transform = 'translateY(0)';
            } else {
              this.desktopNav.style.display = 'none';
            }
          } else {
            // Other pages: always show but with scroll effects
            this.desktopNav.style.display = 'flex';
            if (isScrollingDown) {
              this.desktopNav.style.transform = 'translateY(-100%)';
            } else {
              this.desktopNav.style.transform = 'translateY(0)';
            }
          }
        }
      }
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile view - Force visibility
      if (this.desktopNav) {
        this.desktopNav.style.display = 'none';
      }
      if (this.mobileNav) {
        this.mobileNav.style.display = 'flex';
        this.mobileNav.style.visibility = 'visible';
        this.mobileNav.style.opacity = '1';
        this.mobileNav.style.transform = 'translateY(0)';
        this.mobileNav.style.position = 'fixed';
        this.mobileNav.style.top = '0';
        this.mobileNav.style.left = '0';
        this.mobileNav.style.width = '100%';
        this.mobileNav.style.zIndex = '1000';
      }
    } else {
      // Desktop view
      if (this.mobileNav) {
        this.mobileNav.style.display = 'none';
      }
      if (this.desktopNav) {
        this.desktopNav.style.display = 'flex';
        this.desktopNav.style.visibility = 'visible';
        this.desktopNav.style.opacity = '1';
      }
      
      // Close mobile menu if it was open
      if (this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NavigationManager();
});

// Also initialize on window load as backup
window.addEventListener('load', () => {
  // Force visibility check after everything is loaded
  setTimeout(() => {
    const nav = new NavigationManager();
    nav.forceVisibilityCheck();
  }, 200);
});
