// Emergency scroll fix for pages that can't scroll
document.addEventListener('DOMContentLoaded', function() {
  // Force enable scrolling
  function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.position = '';
    
    // Remove any classes that might prevent scrolling
    document.body.classList.remove('mobile-menu-open', 'no-scroll', 'overflow-hidden');
    document.documentElement.classList.remove('no-scroll', 'overflow-hidden');
  }

  // Run immediately
  enableScroll();

  // Run after a delay to catch any late-loading scripts
  setTimeout(enableScroll, 1000);
  setTimeout(enableScroll, 3000);

  // Run on window resize
  window.addEventListener('resize', enableScroll);

  // Run on focus (when user returns to tab)
  window.addEventListener('focus', enableScroll);
});

// Global function to force enable scrolling
window.forceEnableScroll = function() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.classList.remove('mobile-menu-open', 'no-scroll');
  console.log('Scroll forcefully enabled');
};