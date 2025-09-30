const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('togglePassword');

toggleButton.addEventListener('click', function() {
  // Check if the input type is "password"
  if (passwordInput.type === 'password') {
    // If it is, change it to "text" to show the password
    passwordInput.type = 'text';
    toggleButton.textContent = 'Hide Password';
  } else {
    // Otherwise, change it back to "password"
    passwordInput.type = 'password';
    toggleButton.textContent = 'Show Password';
  }
});