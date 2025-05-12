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

        // Request a Call Popup Handling
        try {
          const requestCallPopup = document.getElementById('requestCallPopup');
          const requestCallBtn = document.getElementById('requestCallBtn');
          const requestCallCloseBtn = document.querySelector('.request-call-close-btn');
          const usBtn = document.getElementById('usBtn');
          const ukBtn = document.getElementById('ukBtn');
          const regionSelection = document.getElementById('regionSelection');
          const calendarSection = document.getElementById('calendarSection');
          const bookingForm = document.getElementById('bookingForm');
          const confirmation = document.getElementById('confirmation');
          const closeConfirmation = document.getElementById('closeConfirmation');
          let calendar;

          if (!requestCallBtn || !requestCallPopup) {
            throw new Error('Request call elements not found');
          }

          requestCallBtn.addEventListener('click', () => {
            console.log('Request call button clicked');
            requestCallPopup.style.display = 'flex';
            regionSelection.classList.remove('hidden');
            calendarSection.classList.add('hidden');
            confirmation.classList.add('hidden');
          });

          requestCallCloseBtn.addEventListener('click', () => {
            console.log('Close popup clicked');
            requestCallPopup.style.display = 'none';
            resetForm();
          });

          closeConfirmation.addEventListener('click', () => {
            console.log('Close confirmation clicked');
            requestCallPopup.style.display = 'none';
            resetForm();
          });

          function resetForm() {
            console.log('Resetting form');
            bookingForm.reset();
            document.getElementById('selectedTime').value = '';
            document.getElementById('timezone').value = '';
            regionSelection.classList.remove('hidden');
            calendarSection.classList.add('hidden');
            confirmation.classList.add('hidden');
            if (calendar) {
              calendar.destroy();
              calendar = null;
            }
          }

          function initCalendar(timezone) {
            console.log('Initializing calendar with timezone:', timezone);
            try {
              const calendarEl = document.getElementById('calendar');
              if (!calendarEl) {
                throw new Error('Calendar element not found');
              }
              if (!window.FullCalendar) {
                throw new Error('FullCalendar library not loaded');
              }
              calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                headerToolbar: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'timeGridWeek,timeGridDay'
                },
                slotMinTime: '09:00:00',
                slotMaxTime: '17:00:00',
                slotDuration: '00:30:00',
                allDaySlot: false,
                timeZone: timezone,
                height: 'auto',
                selectable: true,
                select: function(info) {
                  console.log('Time slot selected:', info.startStr);
                  const start = moment.tz(info.startStr, timezone).format('YYYY-MM-DD HH:mm z');
                  document.getElementById('selectedTime').value = start;
                  document.getElementById('timezone').value = timezone;
                }
              });
              calendar.render();
              console.log('Calendar rendered');
            } catch (e) {
              console.error('Calendar initialization error:', e);
              alert('Failed to load calendar. Please try again.');
            }
          }

          usBtn.addEventListener('click', () => {
            console.log('US button clicked');
            regionSelection.classList.add('hidden');
            calendarSection.classList.remove('hidden');
            initCalendar('America/New_York');
          });

          ukBtn.addEventListener('click', () => {
            console.log('UK button clicked');
            regionSelection.classList.add('hidden');
            calendarSection.classList.remove('hidden');
            initCalendar('Europe/London');
          });

          bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Booking form submitted');
            const name = document.getElementById('bookingName').value;
            const email = document.getElementById('bookingEmail').value;
            const notes = document.getElementById('notes').value;
            const selectedTime = document.getElementById('selectedTime').value;
            const timezone = document.getElementById('timezone').value;

            if (!selectedTime) {
              alert('Please select a time slot.');
              return;
            }

            try {
              const response = await fetch('http://localhost:3000/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, notes, selectedTime, timezone })
              });
              if (!response.ok) throw new Error('Booking failed');

              await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                name,
                email,
                selectedTime,
                timezone,
                notes
              });

              calendarSection.classList.add('hidden');
              confirmation.classList.remove('hidden');
              document.getElementById('confirmationDetails').innerText = `Thank you, ${name}! Your call is scheduled for ${selectedTime}. A confirmation email has been sent to ${email}.`;
              console.log('Booking successful');
            } catch (error) {
              console.error('Booking error:', error);
              alert('Error booking the call. Please try again.');
            }
          });
        } catch (e) {
          console.error('Request a call setup error:', e);
        }
      });

let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function showCallOptions() {
  const regionSelect = document.getElementById("regionSelect");
  if (regionSelect.value) {
    document.getElementById("makeCallPopup").style.display = "flex";
  }
}

function closeMakeCallPopup() {
  document.getElementById("makeCallPopup").style.display = "none";
}

async function startAudioCall() {
  document.getElementById("callStatus").textContent = "Starting audio call...";
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setupCall();
  } catch (error) {
    console.error("Error accessing audio devices:", error);
    document.getElementById("callStatus").textContent = "Failed to start audio call.";
  }
}

async function startVideoCall() {
  document.getElementById("callStatus").textContent = "Starting video call...";
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("videoContainer").style.display = "flex";
    document.getElementById("localVideo").srcObject = localStream;
    setupCall();
  } catch (error) {
    console.error("Error accessing video devices:", error);
    document.getElementById("callStatus").textContent = "Failed to start video call.";
  }
}

function setupCall() {
  peerConnection = new RTCPeerConnection(servers);
  remoteStream = new MediaStream();

  document.getElementById("remoteVideo").srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate:", event.candidate);
    }
  };

  document.getElementById("callStatus").textContent = "Call in progress...";
}