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

  // Check if user is an administrator (all authenticated users are administrators)
  if (window.authManager && window.authManager.isAdministrator()) {
    // User is an administrator - show reports content
    reportsContent.style.display = "block";
    authRequiredMessage.style.display = "none";

    console.log("✅ Reports: Administrator authenticated, showing admin panel");

    // Load and display available reports for download
    loadAvailableReports();
  } else {
    // User is not an administrator - show auth required message with login button
    reportsContent.style.display = "none";
    authRequiredMessage.style.display = "block";

    console.log(
      "📋 Reports: User not authenticated as administrator, showing login prompt"
    );
  }
}

function loadAvailableReports() {
  // Placeholder for future administrator report loading functionality
  console.log("📊 Reports: Loading available administrator reports...");

  // Future implementation will:
  // 1. Fetch available administrative reports from backend
  // 2. Display them in a list with download buttons for administrators
  // 3. Handle administrative report download functionality
  // 4. Show user statistics, system metrics, etc.
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
