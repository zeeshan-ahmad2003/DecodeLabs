// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
  navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
const links = document.querySelectorAll('.nav-links a');
links.forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('active');
  });
});

// Contact Form — connects to backend API
const submitBtn = document.getElementById('submitBtn')
const formResponse = document.getElementById('formResponse')

submitBtn.addEventListener('click', async function() {
  // Get values from form
  const name = document.getElementById('name').value.trim()
  const email = document.getElementById('email').value.trim()
  const message = document.getElementById('message').value.trim()

  // Basic frontend validation
  if (!name || !email || !message) {
    formResponse.className = 'error'
    formResponse.textContent = 'Please fill in all fields!'
    return
  }

  // Disable button while sending
  submitBtn.disabled = true
  submitBtn.textContent = 'Sending...'

  try {
    // Send data to our backend API
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    })

    const data = await response.json()

    if (data.success) {
      formResponse.className = 'success'
      formResponse.textContent = 'Message sent successfully! I will get back to you soon.'
      // Clear the form
      document.getElementById('name').value = ''
      document.getElementById('email').value = ''
      document.getElementById('message').value = ''
    } else {
      formResponse.className = 'error'
      formResponse.textContent = data.error || 'Something went wrong!'
    }

  } catch (error) {
    formResponse.className = 'error'
    formResponse.textContent = 'Could not connect to server. Please try again.'
  }

  // Re-enable button
  submitBtn.disabled = false
  submitBtn.textContent = 'Send Message'
})