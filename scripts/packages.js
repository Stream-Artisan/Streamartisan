// Utility function to debounce events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Focus trapping utility for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, input, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const desktopNav = document.getElementById('desktop-nav');
  const mobileNav = document.getElementById('mobile-nav');
  const hamburger = document.getElementById('hamburger-menu');
  const mobileOverlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('close-mobile-nav');
  const scrollToTopButton = document.getElementById('scrollToTop');
  const privacyLink = document.getElementById('privacyLink');
  const termsLink = document.getElementById('termsLink');
  const floatingButtons = document.querySelector('.floating-buttons');
  const carouselContainer = document.querySelector('.carousel-container');

  // Navigation Toggle
  function toggleNavbars() {
    if (!desktopNav || !mobileNav) return;
    const isDesktop = window.innerWidth > 900;
    desktopNav.style.display = isDesktop ? 'flex' : 'none';
    mobileNav.style.display = isDesktop ? 'none' : window.pageYOffset === 0 ? 'flex' : 'none';
  }

  // Hamburger Menu Toggle
  function toggleMenu() {
    if (!mobileOverlay || !hamburger) return;
    mobileOverlay.classList.toggle('active');
    const isOpen = mobileOverlay.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      trapFocus(mobileOverlay);
      mobileOverlay.querySelector('a, button')?.focus();
    }
  }

  // Modal Handling
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('privacyModal');
      if (modal) {
        modal.style.display = 'flex';
        trapFocus(modal);
        modal.querySelector('button, a')?.focus();
      }
    });
  }

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('termsModal');
      if (modal) {
        modal.style.display = 'flex';
        trapFocus(modal);
        modal.querySelector('button, a')?.focus();
      }
    });
  }

  document.querySelectorAll('.close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'none';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
      e.target.style.display = 'none';
    }
  });

  // Tab Switching
  window.showTabContent = function (tabId) {
    const panes = document.querySelectorAll('.custom-tab-pane, .tab-content');
    const buttons = document.querySelectorAll('.custom-tab-button, .tab');
    panes.forEach((pane) => pane.classList.remove('active'));
    buttons.forEach((button) => button.classList.remove('active'));
    const targetPane = document.getElementById(tabId);
    const targetButton = document.querySelector(`.custom-tab-button[onclick="showTabContent('${tabId}')"], .tab[data-tab="${tabId}"]`);
    if (targetPane && targetButton) {
      targetPane.classList.add('active');
      targetButton.classList.add('active');
      targetButton.setAttribute('aria-selected', 'true');
      buttons.forEach((btn) => {
        if (btn !== targetButton) btn.setAttribute('aria-selected', 'false');
      });
    }
  };

  // Tab Click Handlers
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      if (tabId) showTabContent(tabId);
    });
  });

  // Carousel Auto-Scroll (Vanilla JS replacement for Owl Carousel)
  let autoScrollInterval;
  function startAutoScroll() {
    if (!carouselContainer) return;
    autoScrollInterval = setInterval(() => {
      const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
      if (carouselContainer.scrollLeft >= maxScroll) {
        carouselContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselContainer.scrollBy({ left: carouselContainer.offsetWidth / 2, behavior: 'smooth' });
      }
    }, 3000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  if (carouselContainer) {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoScroll);
      carousel.addEventListener('mouseleave', startAutoScroll);
    }
    startAutoScroll();
  }

  // Floating Buttons
  if (floatingButtons) {
    floatingButtons.addEventListener('click', () => {
      floatingButtons.classList.toggle('expanded');
    });
  }

  window.toggleFloatingButtons = function () {
    if (floatingButtons) floatingButtons.classList.toggle('expanded');
  };

  // Scroll to Top
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll Event Handler
  const handleScroll = debounce(() => {
    if (!mobileNav || !scrollToTopButton || !desktopNav) return;

    // Mobile navbar visibility and scroll effect
    if (window.innerWidth <= 900) {
      mobileNav.style.display = window.pageYOffset === 0 ? 'flex' : 'none';
      mobileNav.style.top = window.pageYOffset > lastScrollTop ? '-150px' : '0';
    }

    // Scroll-to-top button visibility
    scrollToTopButton.classList.toggle('show', window.scrollY > 200);

    // Update scroll progress
    const scrollProgress = window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
    document.body.style.setProperty('--scroll', scrollProgress);

    // Add scrolled class for styling
    const isScrolled = window.pageYOffset > 50;
    if (window.innerWidth > 900) {
      desktopNav.classList.toggle('scrolled', isScrolled);
    } else {
      mobileNav.classList.toggle('scrolled', isScrolled);
    }

    lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset;
  }, 50);

  // Event Listeners
  if (hamburger && closeBtn) {
    hamburger.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  window.addEventListener('resize', toggleNavbars);
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('load', () => {
    toggleNavbars();
    if (mobileNav && window.innerWidth <= 900) {
      mobileNav.style.top = window.pageYOffset > 0 ? '-150px' : '0';
    }
  });

  // Initialize
  toggleNavbars();
});

// Ensure previous scroll listener is not duplicated
window.removeEventListener('scroll', window.scrollListener); // Clean up any existing listener
window.scrollListener = debounce(() => {
  const scrollProgress = window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
  document.body.style.setProperty('--scroll', scrollProgress);
}, 50);
window.addEventListener('scroll', window.scrollListener, false);