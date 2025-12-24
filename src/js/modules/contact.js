/**
 * Contact form handling
 */
export function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!navigator.onLine) {
      showMessage(errorMessage, 'You are currently offline. Please check your internet connection and try again.');
      return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending...';
    
    try {
      const formData = new FormData(form);
      
      // Simple validation
      if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
        throw new Error('Please fill in all required fields.');
      }
      
      // Email validation
      const email = formData.get('email');
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Send form data to Formspree
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Show success message
      showMessage(successMessage, 'Your message has been sent successfully!');
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage(errorMessage, error.message || 'Something went wrong. Please try again later.');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send Message';
    }
  });

  // Helper function to show messages
  function showMessage(element, message) {
    if (!element) return;
    
    element.textContent = message;
    element.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
      element.classList.add('hidden');
    }, 5000);
  }
  
  // Email validation helper
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}
