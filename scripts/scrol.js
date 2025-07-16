  let lastScrollTop = 0;
      const navbar = document.querySelector(".navbar");

      // Hide navbar on page load if not at the top
      window.addEventListener("load", () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 0) {
          navbar.style.top = "-200px";
        } else {
          navbar.style.top = "0";
        }
      });

      window.addEventListener("scroll", () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
          // Scroll down
          navbar.style.top = "-200px";
        } else {
          // Scroll up
          navbar.style.top = "0";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });
      window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);