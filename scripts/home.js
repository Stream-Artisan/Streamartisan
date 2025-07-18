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
  const contactForm = document.getElementById('contact-form');
  const popupForm = document.getElementById('popup-contact-form');
  const floatingButtons = document.querySelector('.floating-buttons');
  const carousel = document.querySelector('.carousel');
  const questionEl = document.getElementById('question');

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
      mobileOverlay.querySelector('a, button').focus();
    }
  }

  // Carousel Auto-Scroll
  let autoScrollInterval;
  function startAutoScroll() {
    const container = document.querySelector('.carousel-container');
    if (!container) return;
    autoScrollInterval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: container.offsetWidth / 2, behavior: 'smooth' });
      }
    }, 3000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Text Animation for Questions
  const questions = [
    'How do I get more people to use my app?',
    'Should I build a native app or a hybrid app?',
    'How to integrate payment methods in my app?',
    'Should I build my app in React Native?',
    'Should I get my designs made in vector form?',
  ];
  let currentQuestion = 0;

  function showQuestion(text, callback) {
    if (!questionEl) return;
    questionEl.innerHTML = '';
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.animationDelay = `${index * 0.03}s`;
      questionEl.appendChild(span);
    });
    setTimeout(callback, text.length * 30 + 2000);
  }

  function cycleQuestions() {
    showQuestion(questions[currentQuestion], () => {
      currentQuestion = (currentQuestion + 1) % questions.length;
      cycleQuestions();
    });
  }

  // Scroll Event Handler
  const handleScroll = debounce(() => {
    if (!mobileNav || !scrollToTopButton) return;

    // Mobile navbar visibility (only for mobile view)
    if (window.innerWidth <= 900) {
      mobileNav.style.display = window.pageYOffset === 0 ? 'flex' : 'none';
    }

    // Scroll-to-top button visibility
    scrollToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';

    // Update scroll progress
    const scrollProgress = window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
    document.body.style.setProperty('--scroll', scrollProgress);

    // Add scrolled class for styling
    const isScrolled = window.pageYOffset > 50;
    if (window.innerWidth > 900) {
      desktopNav?.classList.toggle('scrolled', isScrolled);
    } else {
      mobileNav?.classList.toggle('scrolled', isScrolled);
    }
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

  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
  }

  if (floatingButtons) {
    floatingButtons.addEventListener('click', () => {
      floatingButtons.classList.toggle('expanded');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value,
      };

      try {
        const response = await fetch('http://localhost:5000/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const responseData = await response.json();
        if (response.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          alert(`Failed to send message: ${responseData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error sending message.');
      }
    });
  }

  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Message sent successfully!');
      closePopup();
    });
  }

  // Close popups when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
      e.target.style.display = 'none';
    }
  });

  // Close buttons for popups
  document.querySelectorAll('.close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'none';
    });
  });

  // Window resize handler
  window.addEventListener('resize', toggleNavbars);

  // Scroll to top
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Carousel scroll
  window.scrollCarousel = function (direction) {
    const container = document.querySelector('.carousel-container');
    if (container) {
      const scrollAmount = container.offsetWidth / 2;
      container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  // Tab content switching
  window.showTabContent = function (tabId) {
    const tabs = document.querySelectorAll('.tab-button');
    const panes = document.querySelectorAll('.tab-pane');
    tabs.forEach((tab) => tab.classList.remove('active'));
    panes.forEach((pane) => pane.classList.remove('active'));
    const targetTab = document.querySelector(`[onclick="showTabContent('${tabId}')"]`);
    const targetPane = document.getElementById(tabId);
    if (targetTab && targetPane) {
      targetTab.classList.add('active');
      targetPane.classList.add('active');
    }
  };

  // Toggle floating buttons
  window.toggleFloatingButtons = function () {
    const floatingButtons = document.querySelector('.floating-buttons');
    if (floatingButtons) {
      floatingButtons.classList.toggle('expanded');
    }
  };

  // Open/close popup
  window.openPopup = function () {
    const popup = document.getElementById('contactPopup');
    if (popup) popup.classList.add('active');
  };

  window.closePopup = function () {
    const popup = document.getElementById('contactPopup');
    if (popup) popup.classList.remove('active');
  };

  // Dynamic copyright year
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  // Initialize
  toggleNavbars();
  if (carousel) startAutoScroll();
  if (questionEl) cycleQuestions();
});

// Scroll event listener (already defined above, included here for completeness)
window.addEventListener(
  'scroll',
  debounce(() => {
    if (!mobileNav || !scrollToTopButton) return;

    // Mobile navbar visibility (only for mobile view)
    if (window.innerWidth <= 900) {
      mobileNav.style.display = window.pageYOffset === 0 ? 'flex' : 'none';
    }

    // Scroll-to-top button visibility
    scrollToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';

    // Update scroll progress
    const scrollProgress = window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
    document.body.style.setProperty('--scroll', scrollProgress);