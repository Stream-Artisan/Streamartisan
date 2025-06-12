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
