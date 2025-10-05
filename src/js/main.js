document.addEventListener("DOMContentLoaded", () => {
  // Backend Integration - Initialize API connection
  initializeBackendIntegration();
  // --- This is your existing chart code. Leave it as is. ---
  const chartContainer = document.getElementById("chart-container");
  const chartData = [
    { label: "A", value: 80 },
    { label: "B", value: 74 },
    { label: "C", value: 98 },
    { label: "D", value: 59 },
    { label: "E", value: 53 },
    { label: "F", value: 81 },
    { label: "G", value: 64 },
    { label: "H", value: 101 },
  ];
  const maxValue = Math.max(...chartData.map((item) => item.value));
  chartData.forEach((dataPoint, index) => {
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";
    const barValue = document.createElement("div");
    barValue.className = "bar-value";
    barValue.textContent = dataPoint.value;
    const bar = document.createElement("div");
    bar.className = "bar";
    const barLabel = document.createElement("div");
    barLabel.className = "bar-label";
    barLabel.textContent = dataPoint.label;
    barWrapper.appendChild(barValue);
    barWrapper.appendChild(bar);
    barWrapper.appendChild(barLabel);
    chartContainer.appendChild(barWrapper);
    const delay = index * 150;
    setTimeout(() => {
      bar.style.height = `${(dataPoint.value / maxValue) * 100}%`;
      barWrapper.classList.add("is-visible");
    }, delay);
  });
  const totalAnimationTime = (chartData.length - 1) * 150;
  setTimeout(() => {
    chartContainer.classList.add("is-rotating");
  }, totalAnimationTime + 1200);
  // --- End of existing chart code ---

  // --- ▼▼▼ ADD THIS NEW TYPING ANIMATION CODE ▼▼▼ ---
  const typingElement = document.getElementById("typing-text");
  const wordsToType = ["odpowiedzialny", "dojrzały", "zorganizowany", "tutaj"];
  let wordIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = wordsToType[wordIndex];
    let typeSpeed = 150; // Speed of typing letters

    // Set the text content based on whether we are typing or deleting
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, letterIndex - 1);
      letterIndex--;
      typeSpeed = 75; // Deleting is faster
    } else {
      typingElement.textContent = currentWord.substring(0, letterIndex + 1);
      letterIndex++;
    }

    // Logic to switch states
    if (!isDeleting && letterIndex === currentWord.length) {
      // Finished typing the word, pause, then start deleting
      isDeleting = true;
      typeSpeed = 2000; // Long pause at the end of a word
    } else if (isDeleting && letterIndex === 0) {
      // Finished deleting, move to the next word and start typing
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToType.length; // Loop back to the start
      typeSpeed = 500; // Pause before typing a new word
    }

    // Call the function again after the calculated delay
    setTimeout(typeEffect, typeSpeed);
  }

  // Start the animation
  if (typingElement) {
    typeEffect();
  }
  // --- ▲▲▲ END OF NEW TYPING ANIMATION CODE ▲▲▲ ---

  /**
   * Backend Integration Functions
   */
  async function initializeBackendIntegration() {
    try {
      // Test backend connection
      if (window.apiClient) {
        console.log("Testing backend connection...");
        await window.apiClient.healthCheck();
        console.log("✅ Backend connection successful");

        // Update UI based on connection status
        showConnectionStatus(true);

        // Set up real-time statistics if available
        loadLatestStatistics();
      } else {
        console.warn("API client not available");
        showConnectionStatus(false);
      }
    } catch (error) {
      console.error("Backend connection failed:", error);
      showConnectionStatus(false);
    }
  }

  function showConnectionStatus(isConnected) {
    // Create or update connection indicator
    let indicator = document.querySelector(".connection-status");

    if (!indicator) {
      indicator = document.createElement("div");
      indicator.className = "connection-status";
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(indicator);
    }

    if (isConnected) {
      indicator.innerHTML = `
        <span style="color: #22c55e;">●</span>
        <span style="color: #fff;">Połączono z serwerem</span>
      `;
      indicator.style.background = "rgba(34, 197, 94, 0.9)";

      // Hide after 3 seconds
      setTimeout(() => {
        indicator.style.opacity = "0";
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.remove();
          }
        }, 300);
      }, 3000);
    } else {
      indicator.innerHTML = `
        <span style="color: #ef4444;">●</span>
        <span style="color: #fff;">Brak połączenia</span>
      `;
      indicator.style.background = "rgba(239, 68, 68, 0.9)";
    }
  }

  async function loadLatestStatistics() {
    try {
      if (!window.RetirementAPI) return;

      // Fetch latest calculation statistics from backend
      const reports = await window.RetirementAPI.getReports();

      if (reports && reports.length > 0) {
        updateStatisticsDisplay(reports);
        console.log(`Loaded ${reports.length} calculation reports`);
      }
    } catch (error) {
      console.log("Statistics not available:", error.message);
      // Don't show error to user - statistics are optional
    }
  }

  function updateStatisticsDisplay(reports) {
    // Calculate basic statistics
    const totalCalculations = reports.length;
    const avgAge =
      reports.reduce((sum, r) => sum + (r.age || 0), 0) / totalCalculations;
    const avgSalary =
      reports.filter((r) => r.salary).reduce((sum, r) => sum + r.salary, 0) /
      reports.filter((r) => r.salary).length;

    // Find or create statistics section
    let statsSection = document.querySelector(".live-statistics");

    if (!statsSection) {
      statsSection = document.createElement("div");
      statsSection.className = "live-statistics";
      statsSection.style.cssText = `
        background: rgba(24, 91, 58, 0.1);
        padding: 20px;
        margin: 20px 0;
        border-radius: 8px;
        border-left: 4px solid #185b3a;
      `;

      // Insert after hero section
      const heroSection = document.querySelector(".hero-section");
      if (heroSection && heroSection.parentNode) {
        heroSection.parentNode.insertBefore(
          statsSection,
          heroSection.nextSibling
        );
      }
    }

    statsSection.innerHTML = `
      <h3 style="color: #185b3a; margin: 0 0 15px 0; font-size: 18px;">
        📊 Statystyki na żywo
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #185b3a;">${totalCalculations}</div>
          <div style="font-size: 12px; color: #666;">Obliczeń dzisiaj</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #185b3a;">${Math.round(
            avgAge
          )}</div>
          <div style="font-size: 12px; color: #666;">Średni wiek</div>
        </div>
        ${
          avgSalary
            ? `
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #185b3a;">${formatCurrency(
            avgSalary
          )}</div>
          <div style="font-size: 12px; color: #666;">Średnie wynagrodzenie</div>
        </div>
        `
            : ""
        }
      </div>
    `;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  // Enhanced CTA button functionality
  const ctaButtons = document.querySelectorAll(".cta-link");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Add loading state for better UX
      this.style.opacity = "0.7";
      this.style.transform = "scale(0.98)";

      setTimeout(() => {
        this.style.opacity = "1";
        this.style.transform = "scale(1)";
      }, 150);
    });
  });

  console.log("✅ Main page integration loaded successfully");
});
