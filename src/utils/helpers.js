// Utility functions for the ZUS Retirement Simulator

/**
 * Format currency value to Polish Złoty format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage value
 * @param {number} value - Percentage value (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Polish PESEL (Personal Identification Number)
 * @param {string} pesel - PESEL to validate
 * @returns {boolean} True if valid PESEL
 */
function isValidPesel(pesel) {
  if (!/^\d{11}$/.test(pesel)) return false;

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(pesel[10]);
}

/**
 * Format date to Polish locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pl-PL");
}

/**
 * Calculate age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Age in years
 */
function calculateAge(birthDate) {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showNotification(message, type = "info", duration = 3000) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    min-width: 300px;
    max-width: 500px;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: inherit;
    font-size: 14px;
    line-height: 1.4;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    ${getNotificationColors(type)}
  `;

  // Add to document
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  // Add close functionality
  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    closeNotification(notification);
  });

  // Auto-remove after duration
  setTimeout(() => {
    if (document.body.contains(notification)) {
      closeNotification(notification);
    }
  }, duration);
}

/**
 * Get colors for notification type
 * @param {string} type - Notification type
 * @returns {string} CSS color properties
 */
function getNotificationColors(type) {
  switch (type) {
    case "success":
      return "background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;";
    case "error":
      return "background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;";
    case "warning":
      return "background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7;";
    default:
      return "background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;";
  }
}

/**
 * Close notification with animation
 * @param {HTMLElement} notification - Notification element to close
 */
function closeNotification(notification) {
  notification.style.opacity = "0";
  notification.style.transform = "translateX(100%)";
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 300);
}

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with errors array
 */
function validateFormData(data, rules) {
  const errors = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    if (fieldRules.required && (!value || value.toString().trim() === "")) {
      errors.push(`${fieldRules.label || field} jest wymagane`);
      continue;
    }

    if (
      value &&
      fieldRules.minLength &&
      value.toString().length < fieldRules.minLength
    ) {
      errors.push(
        `${fieldRules.label || field} musi mieć co najmniej ${
          fieldRules.minLength
        } znaków`
      );
    }

    if (
      value &&
      fieldRules.maxLength &&
      value.toString().length > fieldRules.maxLength
    ) {
      errors.push(
        `${fieldRules.label || field} nie może mieć więcej niż ${
          fieldRules.maxLength
        } znaków`
      );
    }

    if (value && fieldRules.min && parseFloat(value) < fieldRules.min) {
      errors.push(
        `${fieldRules.label || field} nie może być mniejsze niż ${
          fieldRules.min
        }`
      );
    }

    if (value && fieldRules.max && parseFloat(value) > fieldRules.max) {
      errors.push(
        `${fieldRules.label || field} nie może być większe niż ${
          fieldRules.max
        }`
      );
    }

    if (value && fieldRules.email && !isValidEmail(value)) {
      errors.push(
        `${fieldRules.label || field} musi być prawidłowym adresem email`
      );
    }

    if (value && fieldRules.pesel && !isValidPesel(value)) {
      errors.push(
        `${fieldRules.label || field} musi być prawidłowym numerem PESEL`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
