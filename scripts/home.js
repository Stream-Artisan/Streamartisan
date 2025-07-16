function toggleMenu() {
  const overlay = document.getElementById("overlay");
  if (overlay.style.width === "100%") {
    overlay.style.width = "0";
  } else {
    overlay.style.width = "100%";
  }
}
window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);
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

      function toggleMenu() {
        const overlay = document.getElementById("overlay");
        if (overlay.style.width === "100%") {
          overlay.style.width = "0";
        } else {
          overlay.style.width = "100%";
        }
      }
      // for scrolling effect
      // let lastScrollTop = 0;
      // const navbar = document.querySelector(".navbar");

      // // Hide navbar on page load if not at the top
      // window.addEventListener("load", () => {
      //   const scrollTop =
      //     window.pageYOffset || document.documentElement.scrollTop;

      //   if (scrollTop > 0) {
      //     navbar.style.top = "-200px";
      //   } else {
      //     navbar.style.top = "0";
      //   }
      // });

      // window.addEventListener("scroll", () => {
      //   const scrollTop =
      //     window.pageYOffset || document.documentElement.scrollTop;

      //   if (scrollTop > lastScrollTop) {
      //     // Scroll down
      //     navbar.style.top = "-200px";
      //   } else {
      //     // Scroll up
      //     navbar.style.top = "0";
      //   }

      //   lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      // });
      //text-animation function

      const questions = [
        "How do i get more people to use my app?",
        "Should i build native app or a hybrid app?",
        "How to integrate payment methods in my app?",
        "Should i build my app in react native?",
        "Should i get my desins made in vector form?",
      ];

      let current = 0;
      const questionEl = document.getElementById("question");

      function showQuestion(text, callback) {
        questionEl.innerHTML = "";

        text.split("").forEach((char, index) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.animationDelay = `${index * 0.03}s`;
          questionEl.appendChild(span);
        });

        const totalTime = text.length * 30 + 2000; // wait a bit longer before next
        setTimeout(callback, totalTime);
      }

      function cycleQuestions() {
        showQuestion(questions[current], () => {
          current = (current + 1) % questions.length;
          cycleQuestions();
        });
      }

      cycleQuestions();

      // Scroll to top functionality
      const scrollToTopButton = document.getElementById("scrollToTop");

      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          scrollToTopButton.style.display = "block";
        } else {
          scrollToTopButton.style.display = "none";
        }
      });

      function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      const form = document.getElementById("contact-form");
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

          const responseData = await response.json(); // Parse the response body
          console.log("Response:", responseData); // Log the response for debugging

          if (response.ok) {
            alert("Message sent successfully!");
            form.reset();
          } else {
            alert(
              `Failed to send message: ${responseData.error || "Unknown error"}`
            );
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error sending message.");
        }
      });

      const floatingButtons = document.querySelector(".floating-buttons");
      floatingButtons.addEventListener("click", () => {
        floatingButtons.classList.toggle("expanded");
      });

      function scrollCarousel(direction) {
        const container = document.querySelector(".carousel-container");
        const scrollAmount = container.offsetWidth / 2;
        container.scrollBy({
          left: direction * scrollAmount,
          behavior: "smooth",
        });
      }

      // Automatically scroll the carousel
      let autoScrollInterval;
      function startAutoScroll() {
        const container = document.querySelector(".carousel-container");
        autoScrollInterval = setInterval(() => {
          container.scrollBy({
            left: container.offsetWidth / 2,
            behavior: "smooth",
          });
        }, 3000); // Adjust the interval as needed
      }

      function stopAutoScroll() {
        clearInterval(autoScrollInterval);
      }

      const carousel = document.querySelector(".carousel");
      carousel.addEventListener("mouseenter", stopAutoScroll);
      carousel.addEventListener("mouseleave", startAutoScroll);

      startAutoScroll();

      function showTabContent(tabId) {
        const tabs = document.querySelectorAll(".tab-button");
        const panes = document.querySelectorAll(".tab-pane");

        tabs.forEach((tab) => tab.classList.remove("active"));
        panes.forEach((pane) => pane.classList.remove("active"));

        document
          .querySelector(`[onclick="showTabContent('${tabId}')"]`)
          .classList.add("active");
        document.getElementById(tabId).classList.add("active");
      }

      function toggleFloatingButtons() {
        document
          .querySelector(".floating-buttons")
          .classList.toggle("expanded");
      }

      function openPopup() {
        document.getElementById("contactPopup").classList.add("active");
      }

      function closePopup() {
        document.getElementById("contactPopup").classList.remove("active");
      }

      document
        .getElementById("popup-contact-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          alert("Message sent successfully!");
          closePopup();
        });
         function sendEmail() {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        if (!name || !email || !message) {
          alert("Please fill out all fields.");
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert("Invalid email format.");
          return;
        }

        const subject = encodeURIComponent("Contact Form Submission");
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
        );
        window.location.href = `mailto:services@streamartisan.com?subject=${subject}&body=${body}`;
      }