//**************************
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

// document.addEventListener("DOMContentLoaded", () => {
//   // Define all possible password field IDs used in any view
//   const appliedIds = ['password', 'new_password', 'confirm_password'];

//   // Try to find all password fields that exist on the current page
//   appliedIds.forEach(id => {
//     const passwordInput = document.getElementById(id);
//     if (!passwordInput) return; // skip if input is not on this page

//     // For each password field, look for its related toggle button
//     // The toggle button should have id="toggle_<passwordId>" for uniqueness
//     const toggleButton = document.getElementById(`toggle_${id}`);

//     if (toggleButton) {
//       console.log(`${id} field detected`);

//       toggleButton.addEventListener("click", function (e) {
//         e.preventDefault(); // prevent form submission (especially on buttons inside forms)
//         if (passwordInput.type === "password") {
//           passwordInput.type = "text";
//           toggleButton.textContent = "Hide Password";
//         } else {
//           passwordInput.type = "password";
//           toggleButton.textContent = "Show Password";
//         }
//       });
//     }
//   });
// });

