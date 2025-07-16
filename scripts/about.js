// Contact form submission
document.addEventListener("DOMContentLoaded", function () {
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
        alert("Error sending message.");
      }
    });
  }

  // Counter logic
  function animateCounter(id, target, delay = 0) {
    let counter = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        if (counter >= target) {
          clearInterval(interval);
        } else {
          counter++;
          document.getElementById(id).textContent = counter.toLocaleString();
        }
      }, 10);
    }, delay);
  }
  animateCounter("products-counter", 230, 0);
  animateCounter("downloads-counter", 5000000, 500);

  // Scroll to Top Button Logic
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

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
});
window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);
  // Open modals
      document.getElementById("privacyLink").onclick = function (e) {
        e.preventDefault();
        document.getElementById("privacyModal").style.display = "block";
      };

      document.getElementById("termsLink").onclick = function (e) {
        e.preventDefault();
        document.getElementById("termsModal").style.display = "block";
      };

      // Close modals
      document.querySelectorAll(".close-btn").forEach((btn) => {
        btn.onclick = function () {
          const targetId = this.getAttribute("data-target");
          document.getElementById(targetId).style.display = "none";
        };
      });

      // Clo
      window.onclick = function (e) {
        if (e.target.classList.contains("popup")) {
          e.target.style.display = "none";
        }
      };
      // Counter logic
      function animateCounter(id, target, delay = 0) {
        let counter = 0;
        setTimeout(() => {
          const interval = setInterval(() => {
            if (counter >= target) {
              clearInterval(interval);
            } else {
              counter++;
              document.getElementById(id).textContent =
                counter.toLocaleString();
            }
          }, 10);
        }, delay);
      }

      animateCounter("products-counter", 230, 0); // No delay
      animateCounter("downloads-counter", 5000000, 500); // Add delay for smoother animation
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

      // Scroll to Top Button Logic
      const scrollToTopBtn = document.getElementById("scrollToTopBtn");

      window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
          scrollToTopBtn.style.display = "block";
        } else {
          scrollToTopBtn.style.display = "none";
        }
      });

      function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
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