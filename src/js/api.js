/**
 * ZUS Retirement Simulator API Client
 * Integrates with FastAPI backend - matches API_DOCUMENTATION.md
 */

class ZUSApiClient {
  constructor() {
    // Backend server URL - update this to match your backend
    this.baseURL = "http://localhost:8000";
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
  }

  /**
   * Make authenticated HTTP request with automatic token refresh
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      defaultHeaders.Authorization = `Bearer ${this.accessToken}`;
    }

    const config = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);

      // If token expired (401), try to refresh automatically
      if (
        response.status === 401 &&
        this.refreshToken &&
        endpoint !== "/token" &&
        endpoint !== "/refresh_token"
      ) {
        const refreshed = await this.refreshTokens();
        if (refreshed) {
          // Retry original request with new token
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          response = await fetch(url, config);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  /**
   * Authentication Methods - Match backend /token endpoint
   */
  async login(username, password) {
    try {
      const response = await this.request("/token", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Store tokens locally
      this.accessToken = response.access_token;
      this.refreshToken = response.refresh_token;

      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("refresh_token", this.refreshToken);
      localStorage.setItem(
        "token_expires_at",
        Date.now() + response.expires_in * 1000
      );
      localStorage.setItem("user_info", JSON.stringify({ username }));

      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Refresh expired tokens - Match backend /refresh_token endpoint
   */
  async refreshTokens() {
    if (!this.refreshToken) {
      this.logout();
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${this.baseURL}/refresh_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      // Update stored tokens
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("refresh_token", this.refreshToken);
      localStorage.setItem(
        "token_expires_at",
        Date.now() + data.expires_in * 1000
      );

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.logout();
      throw error;
    }
  }

  /**
   * Logout and clear stored tokens
   */
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_at");
    localStorage.removeItem("user_info");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem("access_token");
    const expiresAt = localStorage.getItem("token_expires_at");

    if (!token || !expiresAt) {
      return false;
    }

    // Check if token is expired (with 5 minute buffer)
    return Date.now() < parseInt(expiresAt) - 5 * 60 * 1000;
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Retirement Calculation Methods - Match backend endpoints
   */

  /**
   * Generate retirement plan - POST /generate_retirement_plan
   * @param {Object} expectations - Retirement expectations
   * @param {number} expectations.age - Current age (0-120)
   * @param {string} expectations.sex - Gender: "m", "f", "x"
   * @param {number} expectations.expected_retirement_income - Target monthly income
   * @param {boolean} expectations.include_sick - Include sick leave periods
   * @param {number} expectations.funds - Currently accumulated funds
   * @param {number} expectations.start_year - Calculation start year
   * @param {number} expectations.expected_retirement_age - Planned retirement age
   */
  async generateRetirementPlan(expectations) {
    try {
      return await this.request("/generate_retirement_plan", {
        method: "POST",
        body: JSON.stringify(expectations),
      });
    } catch (error) {
      throw new Error(`Failed to generate retirement plan: ${error.message}`);
    }
  }

  /**
   * Calculate retirement income - POST /calc_retirement_income
   * @param {Object} data - Calculation input data
   * @param {number} data.age - Current age
   * @param {string} data.sex - Gender identifier
   * @param {Array} data.work_blocks - Work periods array
   */
  async calculateRetirementIncome(data) {
    try {
      return await this.request("/calc_retirement_income", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(
        `Failed to calculate retirement income: ${error.message}`
      );
    }
  }

  /**
   * Reports and Analytics - GET /reports
   */
  async getReports() {
    try {
      return await this.request("/reports");
    } catch (error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }
  }

  /**
   * Health Check - GET /
   */
  async healthCheck() {
    try {
      return await this.request("/");
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
}

// Create global API client instance
window.apiClient = new ZUSApiClient();

// Helper functions for easier access
window.AuthAPI = {
  login: (username, password) => window.apiClient.login(username, password),
  logout: () => window.apiClient.logout(),
  getCurrentUser: () => window.apiClient.getCurrentUser(),
  isAuthenticated: () => window.apiClient.isAuthenticated(),
  refreshTokens: () => window.apiClient.refreshTokens(),
};

window.RetirementAPI = {
  generatePlan: (expectations) =>
    window.apiClient.generateRetirementPlan(expectations),
  calculateIncome: (data) => window.apiClient.calculateRetirementIncome(data),
  getReports: () => window.apiClient.getReports(),
};

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ZUSApiClient };
}

console.log("✅ ZUS API Client loaded successfully");
