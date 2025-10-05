/**
 * Login Page Integration
 * Handles authentication with the ZUS backend API
 */

document.addEventListener("DOMContentLoaded", function () {
  // Check if API client is loaded
  if (!window.AuthAPI) {
    console.error("API Client not loaded. Make sure api.js is included first.");
    return;
  }

  // Get DOM elements
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = document.querySelector(".signup-btn");

  // Check if already authenticated
  if (window.AuthAPI.isAuthenticated()) {
    console.log("User already authenticated, redirecting...");
    window.location.href = "/src/pages/calculator.html";
    return;
  }

  // Ensure all required elements exist
  if (!loginForm || !emailInput || !passwordInput || !submitButton) {
    console.error("Required form elements not found");
    return;
  }

  // Handle form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic client-side validation
    if (!username || !password) {
      showError("Proszę wypełnić wszystkie pola");
      return;
    }

    // Allow both email and username login
    // Removed email validation to support username-based authentication

    // Show loading state
    setLoadingState(true);
    clearMessages();

    try {
      console.log("Attempting login for user:", username);

      // Call backend API
      const response = await window.AuthAPI.login(username, password);

      console.log("Login successful:", response);

      // Redirect to calculator immediately after successful login
      window.location.href = "/src/pages/calculator.html";
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error scenarios
      let errorMessage = "Wystąpił błąd podczas logowania";

      if (
        error.message.includes("401") ||
        error.message.includes("Błędny login")
      ) {
        errorMessage = "Nieprawidłowy email lub hasło";
      } else if (
        error.message.includes("network") ||
        error.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Problem z połączeniem z serwerem. Sprawdź połączenie z internetem.";
      } else if (error.message.includes("CORS")) {
        errorMessage =
          "Problem z konfiguracją serwera. Skontaktuj się z administratorem.";
      }

      showError(errorMessage);
    } finally {
      setLoadingState(false);
    }
  });

  // Real-time validation
  emailInput.addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
      showFieldError(this, "Nieprawidłowy format adresu email");
    } else {
      clearFieldError(this);
    }
  });

  passwordInput.addEventListener("input", function () {
    if (this.value.length > 0) {
      clearFieldError(this);
    }
  });

  // Enter key support
  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        loginForm.dispatchEvent(new Event("submit"));
      }
    });
  });

  /**
   * UI Helper Functions
   */
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.classList.add("loading");

      // Update button text and show spinner
      const buttonText =
        submitButton.querySelector(".btn-text") || submitButton;
      const originalText = buttonText.textContent;
      buttonText.dataset.originalText = originalText;
      buttonText.textContent = "Logowanie...";

      // Add spinner if it doesn't exist
      let spinner = submitButton.querySelector(".spinner");
      if (!spinner) {
        spinner = document.createElement("div");
        spinner.className = "spinner";
        submitButton.insertBefore(spinner, buttonText);
      }
      spinner.style.display = "inline-block";
    } else {
      submitButton.disabled = false;
      submitButton.classList.remove("loading");

      // Restore button text and hide spinner
      const buttonText =
        submitButton.querySelector(".btn-text") || submitButton;
      const originalText = buttonText.dataset.originalText || "Zaloguj się";
      buttonText.textContent = originalText;

      const spinner = submitButton.querySelector(".spinner");
      if (spinner) {
        spinner.style.display = "none";
      }
    }
  }

  function showError(message) {
    clearMessages();
    const errorDiv = createMessageDiv(message, "error");
    loginForm.insertBefore(errorDiv, loginForm.firstChild);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  function showSuccess(message) {
    clearMessages();
    const successDiv = createMessageDiv(message, "success");
    loginForm.insertBefore(successDiv, loginForm.firstChild);
  }

  function createMessageDiv(message, type) {
    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.innerHTML = `
      <span class="message-icon">${type === "error" ? "⚠️" : "✅"}</span>
      <span class="message-text">${message}</span>
    `;

    // Inline styles for immediate visibility
    div.style.cssText = `
      padding: 12px 16px;
      margin-bottom: 20px;
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: ${type === "error" ? "#fee2e2" : "#f0fdf4"};
      color: ${type === "error" ? "#dc2626" : "#16a34a"};
      border: 1px solid ${type === "error" ? "#fecaca" : "#bbf7d0"};
      animation: slideIn 0.3s ease-out;
    `;

    return div;
  }

  function clearMessages() {
    const messages = loginForm.querySelectorAll(".message");
    messages.forEach((msg) => msg.remove());
  }

  function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add("error");
    const errorSpan = document.createElement("span");
    errorSpan.className = "field-error";
    errorSpan.textContent = message;
    errorSpan.style.cssText = `
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    `;

    field.parentNode.appendChild(errorSpan);
  }

  function clearFieldError(field) {
    field.classList.remove("error");
    const errorSpan = field.parentNode.querySelector(".field-error");
    if (errorSpan) {
      errorSpan.remove();
    }
  }

  function isValidEmail(email) {
    return true; // TODO: change
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Add CSS for loading states and animations
  const style = document.createElement("style");
  style.textContent = `
    .input-group input.error {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1) !important;
    }
    
    .signup-btn.loading {
      cursor: not-allowed;
      opacity: 0.8;
    }
    
    .signup-btn .spinner {
      display: none;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(-10px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `;
  document.head.appendChild(style);

  console.log("✅ Login page integration loaded successfully");
});
