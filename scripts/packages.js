document.addEventListener("DOMContentLoaded", function () {
  // Privacy/Terms modal logic
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  if (privacyLink) {
    privacyLink.onclick = function (e) {
      e.preventDefault();
      document.getElementById("privacyModal").style.display = "flex";
    };
  }
  if (termsLink) {
    termsLink.onclick = function (e) {
      e.preventDefault();
      document.getElementById("termsModal").style.display = "flex";
    };
  }
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.onclick = function () {
      const targetId = this.getAttribute("data-target");
      document.getElementById(targetId).style.display = "none";
    };
  });
  window.onclick = function (e) {
    if (e.target.classList.contains("popup")) {
      e.target.style.display = "none";
    }
  };

  // Tab switching logic
  window.showTabContent = function (tabId) {
    document
      .querySelectorAll(".custom-tab-pane")
      .forEach((pane) => pane.classList.remove("active"));
    document
      .querySelectorAll(".custom-tab-button")
      .forEach((button) => button.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    document
      .querySelector(
        `.custom-tab-button[onclick="showTabContent('${tabId}')"]`
      )
      .classList.add("active");
  };

  // Navbar scroll effect
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");
  window.addEventListener("load", () => {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 0) {
      navbar.style.top = "-150px";
    } else {
      navbar.style.top = "0";
    }
  });
  window.addEventListener("scroll", () => {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      navbar.style.top = "-150px";
    } else {
      navbar.style.top = "0";
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // Scroll to Top Button Logic
  const scrollToTopButton = document.getElementById("scrollToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollToTopButton.classList.add("show");
    } else {
      scrollToTopButton.classList.remove("show");
    }
  });
  window.scrollToTop = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Floating buttons (if used)
  const floatingButtons = document.querySelector(".floating-buttons");
  if (floatingButtons) {
    floatingButtons.addEventListener("click", () => {
      floatingButtons.classList.toggle("expanded");
    });
    window.toggleFloatingButtons = function () {
      floatingButtons.classList.toggle("expanded");
    };
  }
});
window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);
 document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("privacyLink").onclick = function (e) {
      e.preventDefault();
      document.getElementById("privacyModal").style.display = "flex";
    };

    document.getElementById("termsLink").onclick = function (e) {
      e.preventDefault();
      document.getElementById("termsModal").style.display = "flex";
    };

    document.querySelectorAll(".close-btn").forEach((btn) => {
      btn.onclick = function () {
        const targetId = this.getAttribute("data-target");
        document.getElementById(targetId).style.display = "none";
      };
    });

    window.onclick = function (e) {
      if (e.target.classList.contains("popup")) {
        e.target.style.display = "none";
      }
    };
  });

      function showTabContent(tabId) {
        document
          .querySelectorAll(".custom-tab-pane")
          .forEach((pane) => pane.classList.remove("active"));
        document
          .querySelectorAll(".custom-tab-button")
          .forEach((button) => button.classList.remove("active"));
        document.getElementById(tabId).classList.add("active");
        document
          .querySelector(
            `.custom-tab-button[onclick="showTabContent('${tabId}')"]`
          )
          .classList.add("active");
      }
      function openCity(evt, cityName) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
      }
      $(document).ready(function () {
        $(".owl-carousel").owlCarousel({
          loop: true,
          margin: 10,
          nav: true,
          autoplay: true /* Enable autoplay */,
          autoplayTimeout: 3000 /* Set autoplay interval */,
          responsive: {
            0: { items: 2 },
            600: { items: 4 },
            1000: { items: 6 },
          },
        });
      });
      const tabs = document.querySelectorAll(".tab");
      const contents = document.querySelectorAll(".tab-content");

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t) => t.classList.remove("active"));
          contents.forEach((c) => c.classList.remove("active"));

          tab.classList.add("active");
          document.getElementById(tab.dataset.tab).classList.add("active");
        });
      });
      let lastScrollTop = 0;
      const navbar = document.querySelector(".navbar");

      // Hide navbar on page load if not at the top
      window.addEventListener("load", () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 0) {
          navbar.style.top = "-150px";
        } else {
          navbar.style.top = "0";
        }
      });

      window.addEventListener("scroll", () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
          // Scroll down
          navbar.style.top = "-150px";
        } else {
          // Scroll up
          navbar.style.top = "0";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });

      const scrollToTopButton = document.getElementById("scrollToTop");

      window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
          scrollToTopButton.classList.add("show");
        } else {
          scrollToTopButton.classList.remove("show");
        }
      });

      function scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      const floatingButtons = document.querySelector(".floating-buttons");
      floatingButtons.addEventListener("click", () => {
        floatingButtons.classList.toggle("expanded");
      });

      function toggleFloatingButtons() {
        document
          .querySelector(".floating-buttons")
          .classList.toggle("expanded");
      }