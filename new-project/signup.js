document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const submitButton = document.querySelector(".signup-btn");
  const loadingSpinner = document.querySelector(".loading-spinner");
  const buttonText = document.querySelector(".btn-text");

  // Form validation patterns
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      message: "Imię musi zawierać co najmniej 2 litery i tylko litery",
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      message: "Nazwisko musi zawierać co najmniej 2 litery i tylko litery",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Wprowadź poprawny adres email",
    },
    phone: {
      required: false,
      pattern: /^(\+48\s?)?[0-9\s\-]{9,15}$/,
      message: "Wprowadź poprawny numer telefonu",
    },
    birthDate: {
      required: true,
      custom: (value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 100;
      },
      message: "Musisz mieć co najmniej 18 lat",
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      message:
        "Hasło musi zawierać co najmniej 8 znaków, małą i wielką literę oraz cyfrę",
    },
    confirmPassword: {
      required: true,
      custom: (value) => value === document.getElementById("password").value,
      message: "Hasła muszą być identyczne",
    },
    terms: {
      required: true,
      custom: (value, element) => element.checked,
      message: "Musisz zaakceptować regulamin i politykę prywatności",
    },
  };

  // Utility function to show error message
  function showError(element, message) {
    // Remove existing error message
    const existingError = element.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error styling
    element.style.borderColor = "#ff6b6b";

    // Create and show error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "#ff6b6b";
    errorDiv.style.fontSize = "0.8rem";
    errorDiv.style.marginTop = "4px";
    errorDiv.textContent = message;

    element.parentNode.appendChild(errorDiv);
  }

  // Utility function to clear error
  function clearError(element) {
    const existingError = element.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }
    element.style.borderColor = "";
  }

  // Validate single field
  function validateField(fieldName, value, element) {
    const rules = validationRules[fieldName];
    if (!rules) return true;

    // Required validation
    if (rules.required && (!value || value.trim() === "")) {
      showError(
        element,
        `${
          fieldName === "terms" ? "Akceptacja regulaminu" : "To pole"
        } jest wymagane`
      );
      return false;
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && (!value || value.trim() === "")) {
      clearError(element);
      return true;
    }

    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      showError(element, `Minimum ${rules.minLength} znaków`);
      return false;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      showError(element, rules.message);
      return false;
    }

    // Custom validation
    if (rules.custom && !rules.custom(value, element)) {
      showError(element, rules.message);
      return false;
    }

    clearError(element);
    return true;
  }

  // Real-time validation
  Object.keys(validationRules).forEach((fieldName) => {
    const element = document.getElementById(fieldName);
    if (element) {
      element.addEventListener("blur", () => {
        validateField(fieldName, element.value, element);
      });

      element.addEventListener("input", () => {
        // Clear error on input for better UX
        if (element.parentNode.querySelector(".error-message")) {
          clearError(element);
        }
      });
    }
  });

  // Password strength indicator
  const passwordInput = document.getElementById("password");
  const passwordRequirements = document.querySelector(
    ".password-requirements small"
  );

  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLength = password.length >= 8;

    const requirements = [];
    if (!hasLength) requirements.push("8+ znaków");
    if (!hasLower) requirements.push("mała litera");
    if (!hasUpper) requirements.push("wielka litera");
    if (!hasNumber) requirements.push("cyfra");

    if (requirements.length === 0) {
      passwordRequirements.textContent = "Hasło spełnia wszystkie wymagania ✓";
      passwordRequirements.style.color = "#4ade80";
    } else {
      passwordRequirements.textContent = `Brakuje: ${requirements.join(", ")}`;
      passwordRequirements.style.color = "rgba(255, 255, 255, 0.6)";
    }
  });

  // Form submission
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    const formData = new FormData(signupForm);

    Object.keys(validationRules).forEach((fieldName) => {
      const element = document.getElementById(fieldName);
      if (element) {
        const value =
          fieldName === "terms" || fieldName === "marketing"
            ? element.checked
            : element.value;

        if (!validateField(fieldName, value, element)) {
          isValid = false;
        }
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    buttonText.style.display = "none";
    loadingSpinner.style.display = "flex";

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      const userData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        birthDate: formData.get("birthDate"),
        marketingConsent: formData.get("marketing") === "on",
      };

      console.log("User registered:", userData);

      // Show success message
      showSuccessMessage();

      // Redirect after a delay
      setTimeout(() => {
        window.location.href = "main.html";
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showErrorMessage("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
    } finally {
      // Reset loading state
      submitButton.disabled = false;
      buttonText.style.display = "block";
      loadingSpinner.style.display = "none";
    }
  });

  // Success message
  function showSuccessMessage() {
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4ade80;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: 500;
    `;
    successDiv.textContent = "Konto zostało utworzone! Przekierowujemy...";

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  // Error message
  function showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-notification";
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b6b;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: 500;
    `;
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Social login handlers
  document.querySelector(".google-btn")?.addEventListener("click", () => {
    console.log("Google signup initiated");
    // Implement Google OAuth here
  });

  document.querySelector(".facebook-btn")?.addEventListener("click", () => {
    console.log("Facebook signup initiated");
    // Implement Facebook OAuth here
  });

  // Auto-resize textareas and format phone number
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length > 0) {
        if (value.startsWith("48")) {
          value = value.substring(2);
        }

        // Format as XXX XXX XXX
        if (value.length <= 9) {
          value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
          e.target.value = "+48 " + value.trim();
        }
      }
    });
  }
});
