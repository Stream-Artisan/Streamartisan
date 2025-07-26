class NavigationManager {
  constructor() {
    this.mobileNav = document.querySelector('#mobile-nav');
    this.desktopNav = document.querySelector('.desktop-nav');
    this.hamburger = document.querySelector('.hamburger');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    this.lastScrollTop = 0;
    this.isScrolling = false;
    
    this.init();
  }

  init() {
    this.setupMobileNavigation();
    this.setupScrollEffects();
    this.setupActiveLinks();
    this.setupScrollToTop();
    this.setupSmoothScrolling();
  }

  setupMobileNavigation() {
    if (this.hamburger && this.mobileNav) {
      this.hamburger.addEventListener('click', () => {
        this.toggleMobileNav();
      });

      // Close mobile nav when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.mobileNav.contains(e.target) && !this.hamburger.contains(e.target)) {
          this.closeMobileNav();
        }
      });

      // Close mobile nav when clicking on links
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileNav();
        });
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileNav();
        }
      });
    }
  }

  toggleMobileNav() {
    const isActive = this.mobileNav.classList.contains('active');
    
    if (isActive) {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }

  openMobileNav() {
    this.mobileNav.classList.add('active');
    this.hamburger.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus management for accessibility
    const firstLink = this.mobileNav.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  }

  closeMobileNav() {
    this.mobileNav.classList.remove('active');
    this.hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  setupScrollEffects() {
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 16), { passive: true });
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrolled = scrollTop > 50;
    
    // Add scrolled class to navigation
    if (this.desktopNav) {
      this.desktopNav.classList.toggle('scrolled', isScrolled);
    }
    
    if (this.mobileNav) {
      this.mobileNav.classList.toggle('scrolled', isScrolled);
    }

    // Hide/show mobile nav on scroll (only on mobile)
    if (window.innerWidth <= 768) {
      const isScrollingDown = scrollTop > this.lastScrollTop;
      
      if (this.mobileNav && !this.mobileNav.classList.contains('active')) {
        if (isScrollingDown && scrollTop > 100) {
          this.mobileNav.style.transform = 'translateY(-100%)';
        } else {
          this.mobileNav.style.transform = 'translateY(0)';
        }
      }
    }

    // Show/hide scroll to top button
    if (this.scrollToTopBtn) {
      this.scrollToTopBtn.classList.toggle('show', scrollTop > 300);
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  setupActiveLinks() {
    // Highlight active navigation link based on current page
    const currentPath = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath === '/index.html') ||
          (currentPath === '/index.html' && linkPath === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setupScrollToTop() {
    if (this.scrollToTopBtn) {
      this.scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  setupSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Close mobile nav if open
          this.closeMobileNav();
        }
      });
    });
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
    };
  }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
  new NavigationManager();
});