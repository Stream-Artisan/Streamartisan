document.addEventListener("DOMContentLoaded", function () {
  // Contact form submission - Use PHP backend
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        const formData = new FormData(contactForm);
        
        const response = await fetch('/send_email.php', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (response.ok) {
          showNotification('Message sent successfully!', 'success');
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        console.error('Error:', error);
        showNotification('Error sending message. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});
