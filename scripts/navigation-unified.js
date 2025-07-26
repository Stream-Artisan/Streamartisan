class UnifiedNavigationManager {
  constructor() {
    this.desktopNav = document.querySelector('.desktop-navbar');
    this.mobileNav = document.querySelector('.mobile-navbar');
    this.hamburger = document.querySelector('.hamburger, #hamburger-btn');
    this.overlay = document.querySelector('#overlay, .overlay-menu');
    this.closeBtn = document.querySelector('.closebtn');
    this.lastScrollTop = 0;
    this.isMobileMenuOpen = false;
    this.scrollPosition = 0;

    this.init();
  }

  init() {
    // Ensure body can scroll on page load
    this.enableBodyScroll();
    
    this.setupEventListeners();
    this.handleResize();
    this.setupScrollEffects();
    this.forceVisibilityCheck();
  }

  enableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('mobile-menu-open', 'no-scroll');
  }

  disableBodyScroll() {
    this.scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.classList.add('mobile-menu-open');
  }

  restoreBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('mobile-menu-open');
    window.scrollTo(0, this.scrollPosition);
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
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMobileMenu();
      });
    }

    // Close on overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.closeMobileMenu();
        }
      });
    }

    // Window resize - ensure scroll is enabled
    window.addEventListener('resize', this.throttle(() => {
      this.handleResize();
      if (window.innerWidth > 768) {
        this.enableBodyScroll();
      }
    }, 250));

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking nav links
    document.querySelectorAll('.overlay-menu a, .mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Force enable scroll on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.isMobileMenuOpen) {
        this.enableBodyScroll();
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
    if (this.overlay) {
      this.overlay.classList.add('open', 'active');
      this.isMobileMenuOpen = true;
      this.disableBodyScroll();
      
      if (this.hamburger) {
        this.hamburger.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
      }
    }
  }

  closeMobileMenu() {
    if (this.overlay) {
      this.overlay.classList.remove('open', 'active');
      this.isMobileMenuOpen = false;
      this.restoreBodyScroll();
      
      if (this.hamburger) {
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  }

  setupScrollEffects() {
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 16), { passive: true });
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Don't hide navbar if mobile menu is open
    if (this.isMobileMenuOpen) return;

    if (window.innerWidth <= 768) {
      // Mobile: Keep navbar visible at top, hide when scrolling
      if (this.mobileNav) {
        if (scrollTop === 0) {
          this.mobileNav.style.transform = 'translateY(0)';
          this.mobileNav.style.display = 'flex';
        } else {
          this.mobileNav.style.transform = 'translateY(-100%)';
        }
      }
    } else {
      // Desktop: Show/hide based on scroll direction
      if (this.desktopNav) {
        if (scrollTop === 0) {
          this.desktopNav.style.transform = 'translateY(0)';
          this.desktopNav.style.display = 'flex';
        } else if (scrollTop > this.lastScrollTop) {
          this.desktopNav.style.transform = 'translateY(-100%)';
        } else {
          this.desktopNav.style.transform = 'translateY(0)';
        }
      }
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      if (this.desktopNav) this.desktopNav.style.display = 'none';
      if (this.mobileNav) {
        this.mobileNav.style.display = 'flex';
        this.mobileNav.style.visibility = 'visible';
        this.mobileNav.style.opacity = '1';
      }
    } else {
      if (this.mobileNav) this.mobileNav.style.display = 'none';
      if (this.desktopNav) {
        this.desktopNav.style.display = 'flex';
        this.desktopNav.style.visibility = 'visible';
        this.desktopNav.style.opacity = '1';
      }
      // Close mobile menu and restore scroll if it was open
      if (this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }

  forceVisibilityCheck() {
    setTimeout(() => {
      this.handleResize();
      this.enableBodyScroll(); // Ensure scroll is enabled
    }, 100);
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

// Global toggle function for onclick handlers
window.toggleMenu = function() {
  if (window.navManager) {
    window.navManager.toggleMobileMenu();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.navManager = new UnifiedNavigationManager();
});

// Backup initialization
window.addEventListener('load', () => {
  if (!window.navManager) {
    window.navManager = new UnifiedNavigationManager();
  }
});

// Emergency scroll fix - run after everything loads
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('mobile-menu-open', 'no-scroll');
  }, 500);
});
