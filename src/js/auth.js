/**
 * Authentication State Manager
 * Handles global authentication state and UI updates across the application
 */

class AuthManager {
  constructor() {
    this.apiClient = window.apiClient;
    this.callbacks = {
      onLogin: [],
      onLogout: [],
    };

    // Initialize authentication state on page load
    this.init();
  }

  init() {
    // Check authentication status and update UI
    this.updateAuthenticationUI();

    // Set up automatic token refresh
    this.setupTokenRefresh();

    console.log("✅ AuthManager initialized");
  }

  /**
   * Register callbacks for authentication events
   */
  onLogin(callback) {
    this.callbacks.onLogin.push(callback);
  }

  onLogout(callback) {
    this.callbacks.onLogout.push(callback);
  }

  /**
   * Execute registered callbacks
   */
  triggerLoginCallbacks(userInfo) {
    this.callbacks.onLogin.forEach((callback) => {
      try {
        callback(userInfo);
      } catch (error) {
        console.error("Error in login callback:", error);
      }
    });
  }

  triggerLogoutCallbacks() {
    this.callbacks.onLogout.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in logout callback:", error);
      }
    });
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return this.apiClient && this.apiClient.isAuthenticated();
  }

  /**
   * Get current user information
   */
  getCurrentUser() {
    return this.apiClient ? this.apiClient.getCurrentUser() : null;
  }

  /**
   * Perform logout
   */
  logout() {
    if (this.apiClient) {
      this.apiClient.logout();
    }

    this.triggerLogoutCallbacks();
    this.updateAuthenticationUI();

    // Redirect to login page
    if (window.location.pathname !== "/src/pages/login.html") {
      window.location.href = "/src/pages/login.html";
    }
  }

  /**
   * Update UI based on authentication state
   */
  updateAuthenticationUI() {
    const isAuth = this.isAuthenticated();
    const user = this.getCurrentUser();

    // Update navigation links
    this.updateNavigationLinks(isAuth);

    // Update user info display
    this.updateUserDisplay(isAuth, user);

    // Update page access
    this.checkPageAccess();
  }

  /**
   * Update navigation links based on auth state
   */
  updateNavigationLinks(isAuthenticated) {
    const loginLinks = document.querySelectorAll('a[href*="login"]');
    const protectedLinks = document.querySelectorAll(
      'a[href*="calculator"], a[href*="reports"]'
    );

    loginLinks.forEach((link) => {
      if (isAuthenticated) {
        // Change login link to logout
        link.textContent = "WYLOGUJ";
        link.onclick = (e) => {
          e.preventDefault();
          this.logout();
        };
      } else {
        // Restore original login link
        link.textContent = "LOGIN";
        link.onclick = null;
      }
    });

    // Show/hide protected links
    protectedLinks.forEach((link) => {
      if (!isAuthenticated) {
        link.style.opacity = "0.5";
        link.title = "Wymagane logowanie";
        link.onclick = (e) => {
          e.preventDefault();
          alert("Proszę się zalogować, aby uzyskać dostęp do tej funkcji.");
          window.location.href = "/src/pages/login.html";
        };
      } else {
        link.style.opacity = "1";
        link.title = "";
        link.onclick = null;
      }
    });
  }

  /**
   * Update user display information
   */
  updateUserDisplay(isAuthenticated, user) {
    // Find or create user info display
    let userDisplay = document.querySelector(".user-display");

    if (isAuthenticated && user) {
      if (!userDisplay) {
        userDisplay = this.createUserDisplay();
      }

      userDisplay.innerHTML = `
        <span class="user-greeting">Witaj, ${user.username}</span>
        <button class="logout-btn" onclick="authManager.logout()">Wyloguj</button>
      `;
      userDisplay.style.display = "flex";
    } else if (userDisplay) {
      userDisplay.style.display = "none";
    }
  }

  /**
   * Create user display element
   */
  createUserDisplay() {
    const userDisplay = document.createElement("div");
    userDisplay.className = "user-display";
    userDisplay.style.cssText = `
      display: none;
      align-items: center;
      gap: 10px;
      margin-left: auto;
      font-size: 12px;
      color: #fff;
    `;

    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.appendChild(userDisplay);
    }

    return userDisplay;
  }

  /**
   * Check if current page requires authentication
   */
  checkPageAccess() {
    const currentPath = window.location.pathname;
    const protectedPages = [
      "/src/pages/calculator.html",
      "/src/pages/reports.html",
    ];
    const isProtectedPage = protectedPages.some((page) =>
      currentPath.includes(page)
    );

    if (isProtectedPage && !this.isAuthenticated()) {
      console.log(
        "Redirecting to login - protected page accessed without authentication"
      );
      setTimeout(() => {
        window.location.href = "/src/pages/login.html";
      }, 100);
    }
  }

  /**
   * Set up automatic token refresh
   */
  setupTokenRefresh() {
    // Check token expiration every 5 minutes
    setInterval(() => {
      if (this.isAuthenticated()) {
        const expiresAt = localStorage.getItem("token_expires_at");
        if (expiresAt) {
          const timeUntilExpiry = parseInt(expiresAt) - Date.now();

          // If token expires in less than 10 minutes, try to refresh
          if (timeUntilExpiry < 10 * 60 * 1000 && timeUntilExpiry > 0) {
            console.log("Token expiring soon, attempting refresh...");
            this.refreshToken();
          }
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  /**
   * Attempt to refresh authentication token
   */
  async refreshToken() {
    if (!this.apiClient) return false;

    try {
      await this.apiClient.refreshTokens();
      console.log("✅ Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.logout();
      return false;
    }
  }

  /**
   * Handle successful login
   */
  handleLoginSuccess(response, userInfo) {
    console.log("Login successful, updating auth state");
    this.triggerLoginCallbacks(userInfo);
    this.updateAuthenticationUI();
  }

  /**
   * Require authentication for a function
   */
  requireAuth(callback, redirectUrl = "/src/pages/login.html") {
    return (...args) => {
      if (this.isAuthenticated()) {
        return callback(...args);
      } else {
        alert("Ta funkcja wymaga zalogowania.");
        window.location.href = redirectUrl;
      }
    };
  }

  /**
   * Add authentication guard to elements
   */
  guardElement(element, message = "Ta funkcja wymaga zalogowania.") {
    if (!element) return;

    const originalOnClick = element.onclick;

    element.onclick = (e) => {
      if (!this.isAuthenticated()) {
        e.preventDefault();
        alert(message);
        window.location.href = "/src/pages/login.html";
        return false;
      }

      if (originalOnClick) {
        return originalOnClick.call(element, e);
      }
    };
  }
}

// Initialize global auth manager
window.authManager = new AuthManager();

// Add CSS for user display
const authStyle = document.createElement("style");
authStyle.textContent = `
  .user-display {
    align-items: center;
    gap: 10px;
  }
  
  .user-greeting {
    color: #fff;
    font-size: 12px;
  }
  
  .logout-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;
document.head.appendChild(authStyle);

console.log("✅ Authentication manager loaded successfully");
