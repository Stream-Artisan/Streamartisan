// Enhanced Lazy Loading Implementation
class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.loadedImages = new Set();
    this.init();
  }

  init() {
    // Check for Intersection Observer support
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }

    this.addLoadingStyles();
    this.setupErrorHandling();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.1
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
        }
      });
    }, options);

    // Observe all lazy images
    this.observeImages();
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]:not([data-loaded])');
    
    lazyImages.forEach(img => {
      // Add loading placeholder
      this.addLoadingPlaceholder(img);
      this.imageObserver.observe(img);
    });
  }

  loadImage(img) {
    if (this.loadedImages.has(img)) return;

    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Image loaded successfully
      img.src = src;
      if (srcset) img.srcset = srcset;
      
      img.classList.remove('lazy', 'loading');
      img.classList.add('loaded');
      img.setAttribute('data-loaded', 'true');
      
      this.loadedImages.add(img);
      this.imageObserver.unobserve(img);
    };

    imageLoader.onerror = () => {
      // Handle loading error
      this.handleImageError(img);
    };

    // Start loading
    img.classList.add('loading');
    imageLoader.src = src;
  }

  handleImageError(img) {
    img.classList.remove('lazy', 'loading');
    img.classList.add('error');
    
    // Set fallback image or placeholder
    img.src = '/images/placeholder.svg';
    img.alt = 'Image could not be loaded';
    
    this.imageObserver.unobserve(img);
  }

  addLoadingPlaceholder(img) {
    if (!img.classList.contains('lazy')) {
      img.classList.add('lazy');
    }

    // Add blur placeholder if data-placeholder exists
    if (img.dataset.placeholder) {
      img.src = img.dataset.placeholder;
    }
  }

  loadAllImages() {
    // Fallback: load all images immediately
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      img.classList.remove('lazy');
      img.classList.add('loaded');
    });
  }

  addLoadingStyles() {
    if (document.getElementById('lazy-loading-styles')) return;

    const style = document.createElement('style');
    style.id = 'lazy-loading-styles';
    style.textContent = `
      .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
        min-height: 200px;
        display: block;
      }
      
      .loading {
        opacity: 0.7;
      }
      
      .loaded {
        opacity: 1;
        background: none;
        animation: none;
      }
      
      .error {
        opacity: 0.5;
        background: #f8f8f8;
        border: 2px dashed #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 14px;
      }
      
      @keyframes loading-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Responsive image improvements */
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }
      
      /* Prevent layout shift */
      img[data-src] {
        width: 100%;
        object-fit: cover;
      }
    `;
    
    document.head.appendChild(style);
  }

  setupErrorHandling() {
    // Global image error handler
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        this.handleImageError(e.target);
      }
    }, true);
  }

  // Public method to manually trigger loading of new images
  refresh() {
    if (this.imageObserver) {
      this.observeImages();
    }
  }
}

// Initialize lazy loader
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader();
});

// Refresh lazy loader when new content is added dynamically
window.addEventListener('load', () => {
  if (window.lazyLoader) {
    window.lazyLoader.refresh();
  }
});
