document.addEventListener("DOMContentLoaded", () => {
  // Handle "animate-on-scroll" elements
  const scrollElements = document.querySelectorAll(".animate-on-scroll");

  const elementInView = (el, offset = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
  };

  const displayScrollElement = (element) => {
    element.classList.add("visible");
  };

  const hideScrollElement = (element) => {
    element.classList.remove("visible");
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };

  window.addEventListener("scroll", handleScrollAnimation);

  // Handle "animate-on-load" elements
  const loadElements = document.querySelectorAll(".animate-on-load");
  loadElements.forEach((el) => el.classList.add("loaded"));
});
