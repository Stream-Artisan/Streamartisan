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

  // Navbar scroll effect
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");
  window.addEventListener("load", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    navbar.style.top = scrollTop > 0 ? "-150px" : "0";
  });
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    navbar.style.top = scrollTop > lastScrollTop ? "-150px" : "0";
    lastScrollTop = Math.max(0, scrollTop);
  });

  // Scroll to Top Button Logic
  const scrollToTopButton = document.getElementById("scrollToTop");
  window.addEventListener("scroll", () => {
    scrollToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
  });
  if (scrollToTopButton) {
    scrollToTopButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// Global scrollToTop for inline onclick
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
