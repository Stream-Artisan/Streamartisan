  function sendEmail() {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Invalid email format.');
        return;
      }

      const subject = encodeURIComponent('Contact Form Submission');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage:\n${message}`);
      window.location.href = `mailto:services@streamartisan.com?subject=${subject}&body=${body}`;
    }