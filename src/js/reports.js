/**
 * Reports page functionality
 * Handles authentication check and content display
 */

document.addEventListener("DOMContentLoaded", () => {
  // Wait for auth manager to initialize
  setTimeout(() => {
    initializeReportsPage();
  }, 100);
});

function initializeReportsPage() {
  const reportsContent = document.getElementById("reports-content");
  const authRequiredMessage = document.getElementById("auth-required-message");

  // Check if user is authenticated
  if (window.authManager && window.authManager.isAuthenticated()) {
    // User is logged in - show reports content
    reportsContent.style.display = "block";
    authRequiredMessage.style.display = "none";

    console.log("✅ Reports: User authenticated, showing reports content");

    // Future: Load and display available reports for download
    loadAvailableReports();
  } else {
    // User is not logged in - show auth required message with login button
    reportsContent.style.display = "none";
    authRequiredMessage.style.display = "block";

    console.log("📋 Reports: User not authenticated, showing login prompt");
  }
}

function loadAvailableReports() {
  // Placeholder for future report loading functionality
  console.log("📊 Reports: Loading available reports...");

  // Future implementation will:
  // 1. Fetch available reports from backend
  // 2. Display them in a list with download buttons
  // 3. Handle report download functionality
}

// Listen for authentication state changes
if (window.authManager) {
  window.authManager.onLogin(() => {
    initializeReportsPage();
  });

  window.authManager.onLogout(() => {
    initializeReportsPage();
  });
}
