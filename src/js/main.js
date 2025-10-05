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

  // --- ▼▼▼ SCROLL INDICATOR HIDE FUNCTIONALITY ▼▼▼ ---
  const scrollIndicator = document.querySelector(".scroll-indicator");

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollIndicator) {
      if (scrollTop > 100) {
        // Hide scroll indicator when user scrolls down more than 100px
        scrollIndicator.style.opacity = "0";
        scrollIndicator.style.transform = "translateY(20px)";
      } else {
        // Show scroll indicator when at the top
        scrollIndicator.style.opacity = "1";
        scrollIndicator.style.transform = "translateY(0)";
      }
    }
  }

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);

  // Initial check in case page loads scrolled
  handleScroll();
  // --- ▲▲▲ END OF SCROLL INDICATOR FUNCTIONALITY ▲▲▲ ---

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
      } else {
        console.warn("API client not available");
      }
    } catch (error) {
      console.error("Backend connection failed:", error);
    }
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
