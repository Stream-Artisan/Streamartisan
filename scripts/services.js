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
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    navbar.style.top = scrollTop > 0 ? "-150px" : "0";
  });
  window.addEventListener("scroll", () => {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    navbar.style.top = scrollTop > lastScrollTop ? "-150px" : "0";
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // Scroll to Top Button Logic
  const scrollToTopButton = document.getElementById("scrollToTop");
  window.addEventListener("scroll", () => {
    scrollToTopButton.classList.toggle("show", window.scrollY > 200);
  });
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Contact form submission
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      };
      try {
        const response = await fetch("http://localhost:5000/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Message sent successfully!");
          form.reset();
        } else {
          alert("Failed to send message.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

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
});
