document.addEventListener("DOMContentLoaded", () => {
  // UPDATED: Select both fill elements and both text elements
  const fillLeft = document.querySelector(".loading-fill-left");
  const fillRight = document.querySelector(".loading-fill-right");
  const textElements = document.querySelectorAll(".loading-progress-text");
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1; // Slower loading simulation
    if (progress > 100) {
      progress = 100;
    }

    // UPDATED: Update the width of both bars
    fillLeft.style.width = `${progress}%`;
    fillRight.style.width = `${progress}%`;

    // UPDATED: Update the text content of both percentage elements
    textElements.forEach((text) => {
      text.textContent = `${progress}%`;
    });

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        window.location.href = "main.html";
      }, 500);
    }
  }, 150); // Update every 150ms
});
