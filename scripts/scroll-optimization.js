// Unified scroll handler to replace multiple listeners
class ScrollManager {
  constructor() {
    this.handlers = new Map();
    this.isScrolling = false;
    this.scrollData = {
      scrollY: 0,
      scrollProgress: 0,
      isAtTop: true,
      direction: 'down',
      lastScrollY: 0
    };
    
    this.init();
  }

  init() {
    // Use passive listeners for better performance
    window.addEventListener('scroll', this.throttledScroll.bind(this), { 
      passive: true 
    });
    
    // Initial scroll data
    this.updateScrollData();
  }

  throttledScroll() {
    if (!this.isScrolling) {
      requestAnimationFrame(() => {
        this.handleScroll();
        this.isScrolling = false;
      });
      this.isScrolling = true;
    }
  }

  handleScroll() {
    this.updateScrollData();
    
    // Execute all registered handlers
    this.handlers.forEach((handler, name) => {
      try {
        handler(this.scrollData);
      } catch (error) {
        console.error(`Scroll handler '${name}' error:`, error);
      }
    });
  }

  updateScrollData() {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.body.offsetHeight - window.innerHeight;
    
    this.scrollData = {
      scrollY: currentScrollY,
      scrollProgress: maxScroll > 0 ? currentScrollY / maxScroll : 0,
      isAtTop: currentScrollY === 0,
      direction: currentScrollY > this.scrollData.lastScrollY ? 'down' : 'up',
      lastScrollY: this.scrollData.scrollY,
      maxScroll: maxScroll
    };
  }

  addHandler(name, handler) {
    if (typeof handler === 'function') {
      this.handlers.set(name, handler);
    }
  }

  removeHandler(name) {
    this.handlers.delete(name);
  }

  // Get current scroll data without triggering handlers
  getScrollData() {
    this.updateScrollData();
    return { ...this.scrollData };
  }
}

// Initialize scroll manager
const scrollManager = new ScrollManager();

// Register common scroll handlers
scrollManager.addHandler('navigation', (data) => {
  const nav = document.querySelector('.navbar, .desktop-nav');
  if (nav) {
    nav.classList.toggle('scrolled', data.scrollY > 50);
  }
});

scrollManager.addHandler('scrollToTop', (data) => {
  const btn = document.querySelector('.scroll-to-top');
  if (btn) {
    btn.classList.toggle('show', data.scrollY > 300);
  }
});

scrollManager.addHandler('scrollProgress', (data) => {
  document.body.style.setProperty('--scroll-progress', data.scrollProgress);
});

scrollManager.addHandler('parallax', (data) => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  parallaxElements.forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.5;
    const yPos = -(data.scrollY * speed);
    el.style.transform = `translateY(${yPos}px)`;
  });
});

// Export for global use
window.scrollManager = scrollManager;
