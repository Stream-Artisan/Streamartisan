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
    if (window.scrollY > 200) {
      scrollToTopButton.classList.add("show");
    } else {
      scrollToTopButton.classList.remove("show");
    }
  });
  scrollToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

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
        alert("Error sending message.");
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
});
    // Initialize EmailJS
      try {
        emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS user ID
        console.log('EmailJS initialized');
      } catch (e) {
        console.error('EmailJS initialization failed:', e);
      }

      document.addEventListener("DOMContentLoaded", function () {
        // Privacy and Terms Modals
        try {
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
        } catch (e) {
          console.error('Modal setup error:', e);
        }

        // Navbar Scroll Handling
        try {
          let lastScrollTop = 0;
          const navbar = document.querySelector(".navbar");

          window.addEventListener("load", () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 0) {
              navbar.style.top = "-150px";
            } else {
              navbar.style.top = "0";
            }
          });

          window.addEventListener("scroll", () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
              navbar.style.top = "-150px";
            } else {
              navbar.style.top = "0";
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
          });
        } catch (e) {
          console.error('Navbar scroll error:', e);
        }

        // Scroll to Top
        try {
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
        } catch (e) {
          console.error('Scroll to top error:', e);
        }

        // Contact Form Submission
        try {
          const form = document.getElementById('contact-form');
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
              name: form.name.value,
              email: form.email.value,
              message: form.message.value
            };
            try {
              const response = await fetch('http://localhost:5000/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
              });
              if (response.ok) {
                alert('Message sent successfully!');
                form.reset();
              } else {
                alert('Failed to send message.');
              }
            } catch (error) {
              console.error('Contact form error:', error);
              alert('Error sending message.');
            }
          });
        } catch (e) {
          console.error('Contact form setup error:', e);
        }

        // Floating Buttons (if applicable)
        try {
          const floatingButtons = document.querySelector(".floating-buttons");
          if (floatingButtons) {
            floatingButtons.addEventListener("click", () => {
              floatingButtons.classList.toggle("expanded");
            });
          }

          function toggleFloatingButtons() {
            if (floatingButtons) {
              floatingButtons.classList.toggle("expanded");
            }
          }
        } catch (e) {
          console.error('Floating buttons error:', e);
        }
      });