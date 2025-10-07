document.addEventListener("DOMContentLoaded", () => {
  const accountForm = document.querySelector("#update-account-form");
  const passwordForm = document.querySelector("#update-password-form");

  // 🔹 Utility function to show errors
  const showError = (element, message) => {
    const errorContainer = element.parentElement.querySelector(".error");
    if (errorContainer) {
      errorContainer.textContent = message;
    } else {
      const span = document.createElement("span");
      span.className = "error";
      span.textContent = message;
      element.parentElement.appendChild(span);
    }
    element.classList.add("input-error");
  };

  // 🔹 Clear previous errors
  const clearErrors = (form) => {
    form.querySelectorAll(".error").forEach(e => e.remove());
    form.querySelectorAll(".input-error").forEach(i => i.classList.remove("input-error"));
  };

  // Validate account info form
  if (accountForm) {
    accountForm.addEventListener("submit", (e) => {
      clearErrors(accountForm);
      let valid = true;

      const firstName = accountForm.querySelector("[name='account_firstname']");
      const lastName = accountForm.querySelector("[name='account_lastname']");
      const email = accountForm.querySelector("[name='account_email']");

      if (firstName.value.trim().length < 2) {
        showError(firstName, "First name must be at least 2 characters long.");
        valid = false;
      }
      if (lastName.value.trim().length < 2) {
        showError(lastName, "Last name must be at least 2 characters long.");
        valid = false;
      }

      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailPattern.test(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        valid = false;
      }

      if (!valid) e.preventDefault();
    });
  }

  // ✅ Validate password form
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      clearErrors(passwordForm);
      let valid = true;

      const password = passwordForm.querySelector("[name='new_password']");
      const confirmPassword = passwordForm.querySelector("[name='confirm_password']");

      const passwordValue = password.value.trim();

      const passwordRules = [
        { test: passwordValue.length >= 12, message: "Password must be at least 12 characters long." },
        { test: /[A-Z]/.test(passwordValue), message: "Password must contain at least one uppercase letter." },
        { test: /\d/.test(passwordValue), message: "Password must contain at least one number." },
        { test: /[!@#$%^&*(),.?\":{}|<>]/.test(passwordValue), message: "Password must contain at least one special character." },
      ];

      for (const rule of passwordRules) {
        if (!rule.test) {
          showError(password, rule.message);
          valid = false;
          break;
        }
      }

      if (passwordValue !== confirmPassword.value.trim()) {
        showError(confirmPassword, "Passwords do not match.");
        valid = false;
      }

      if (!valid) e.preventDefault();
    });
  }
});
