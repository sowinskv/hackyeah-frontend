/**
 * Calculator Page Integration with ZUS Backend API
 * Handles retirement calculations using real backend endpoints
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check if API client is loaded
  if (!window.RetirementAPI || !window.apiClient) {
    console.error("API Client not loaded. Make sure api.js is included first.");
    showError("Błąd: Nie można połączyć się z serwerem. Odśwież stronę.");
    return;
  }

  console.log("✅ Calculator integration loading...");

  // DOM Elements
  const modeSelection = document.getElementById("mode-selection");
  const stepperForm = document.getElementById("stepper-form");
  const forwardModeBtn = document.getElementById("forward-mode-btn");
  const reverseModeBtn = document.getElementById("reverse-mode-btn");

  // State Management
  let calculatorMode = ""; // 'forward' or 'reverse'
  let currentStep = 0;
  let highestStepReached = 0;

  // Mode Selection Handlers
  forwardModeBtn.addEventListener("click", () => setMode("forward"));
  reverseModeBtn.addEventListener("click", () => setMode("reverse"));

  function setMode(mode) {
    calculatorMode = mode;
    modeSelection.style.display = "none";
    stepperForm.style.display = "block";

    // Show appropriate step sections based on mode
    document
      .querySelectorAll(".forward-step")
      .forEach(
        (el) => (el.style.display = mode === "forward" ? "block" : "none")
      );
    document
      .querySelectorAll(".reverse-step")
      .forEach(
        (el) => (el.style.display = mode === "reverse" ? "block" : "none")
      );

    resetCalculator();
    console.log(`Calculator mode set to: ${mode}`);
  }

  function getActiveSteps() {
    return document.querySelectorAll(`.accordion-step.${calculatorMode}-step`);
  }

  function updateSteps() {
    const activeSteps = getActiveSteps();
    activeSteps.forEach((step, index) => {
      const isCurrent = index === currentStep;
      step.classList.toggle("active", isCurrent);
      if (index <= highestStepReached) {
        step.classList.add("unlocked");
      }
    });
  }

  // Event Listeners for Form Navigation
  stepperForm.addEventListener("click", (e) => {
    if (e.target.matches(".next-btn")) handleNext();
    if (e.target.matches(".prev-btn")) handlePrev();
    if (e.target.matches("#start-over-btn, #start-over-btn-rev"))
      resetCalculator();
  });

  stepperForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(`Submitting ${calculatorMode} calculation...`);

    // Validate visible fields before submission
    if (!validateCurrentMode()) {
      console.log("Validation failed, stopping submission");
      return;
    }

    if (calculatorMode === "forward") {
      await handleForwardSubmit();
    } else if (calculatorMode === "reverse") {
      await handleReverseSubmit();
    }
  });

  // Validate only the fields in the current mode
  function validateCurrentMode() {
    const activeSteps = document.querySelectorAll(
      `.${calculatorMode}-step:not(.result-step)`
    );
    let isValid = true;
    let firstInvalidField = null;

    activeSteps.forEach((step) => {
      const requiredFields = step.querySelectorAll(
        "input[required], select[required]"
      );
      requiredFields.forEach((field) => {
        // Skip validation if the field is hidden or in a hidden step
        if (field.offsetParent === null) return;

        if (!field.value.trim()) {
          isValid = false;
          if (!firstInvalidField) {
            firstInvalidField = field;
          }
          field.classList.add("error");
        } else {
          field.classList.remove("error");
        }
      });
    });

    if (!isValid && firstInvalidField) {
      firstInvalidField.focus();
      showError("Proszę wypełnić wszystkie wymagane pola");
    }

    return isValid;
  }

  function handleNext() {
    const currentStepElement = getActiveSteps()[currentStep];
    if (!currentStepElement) return;

    const inputs = [...currentStepElement.querySelectorAll("input[required]")];
    const isValid = inputs.every((input) => {
      if (!input.reportValidity()) {
        input.focus();
        return false;
      }
      return true;
    });

    if (isValid) {
      currentStep++;
      if (currentStep > highestStepReached) highestStepReached = currentStep;
      updateSteps();
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      currentStep--;
      updateSteps();
    }
  }

  function resetCalculator() {
    currentStep = 0;
    highestStepReached = 0;
    stepperForm.reset();
    document.querySelectorAll(".accordion-step").forEach((step) => {
      step.classList.remove("unlocked", "active");
    });
    updateSteps();
    clearResults();
  }

  // Add header click listeners for accordion navigation
  document.querySelectorAll(".step-header").forEach((header) => {
    header.addEventListener("click", () => {
      const stepElement = header.closest(".accordion-step");
      if (stepElement && stepElement.classList.contains("unlocked")) {
        const stepIndex = parseInt(stepElement.dataset.step);
        if (!isNaN(stepIndex)) {
          currentStep = stepIndex;
          updateSteps();
        }
      }
    });
  });

  /**
   * Backend-Integrated Calculation Functions
   */

  async function handleForwardSubmit() {
    try {
      setLoadingState(true);
      console.log("Collecting form data for income calculation...");

      // Collect form data for backend API
      const calculationData = collectForwardFormData();
      console.log("Form data collected:", calculationData);

      // Call backend API
      const results = await window.RetirementAPI.calculateIncome(
        calculationData
      );
      console.log("Backend response:", results);

      // Display results in UI
      displayForwardResults(results);

      // Move to results step
      currentStep++;
      if (currentStep > highestStepReached) highestStepReached = currentStep;
      updateSteps();
    } catch (error) {
      console.error("Forward calculation error:", error);
      showError(`Błąd obliczenia emerytury: ${error.message}`);
    } finally {
      setLoadingState(false);
    }
  }

  async function handleReverseSubmit() {
    try {
      setLoadingState(true);
      console.log("Collecting form data for retirement plan...");

      // Collect form data for backend API
      const planData = collectReverseFormData();
      console.log("Plan data collected:", planData);

      // Call backend API
      const results = await window.RetirementAPI.generatePlan(planData);
      console.log("Backend response:", results);

      // Display results in UI
      displayReverseResults(results);

      // Move to results step
      currentStep++;
      if (currentStep > highestStepReached) highestStepReached = currentStep;
      updateSteps();
    } catch (error) {
      console.error("Reverse calculation error:", error);
      showError(`Błąd generowania planu: ${error.message}`);
    } finally {
      setLoadingState(false);
    }
  }

  /**
   * Data Collection Functions - Match Backend API Schema
   */

  function collectForwardFormData() {
    // Collect basic information
    const age = parseInt(document.getElementById("age")?.value) || 30;
    const sex =
      document.querySelector('input[name="sex"]:checked')?.value || "m";

    // Collect work blocks data
    const workBlocks = [];
    const grossSalary =
      parseFloat(document.getElementById("salary")?.value) || 0;
    const startYear =
      parseInt(document.getElementById("start-year")?.value) ||
      new Date().getFullYear();
    const endYear =
      parseInt(document.getElementById("end-year")?.value) || startYear + 30;
    const workYears = endYear - startYear;

    if (grossSalary > 0 && workYears > 0) {
      workBlocks.push({
        years: workYears,
        gross_income: grossSalary,
        contribution_rate: 0.1952, // Standard ZUS rate
      });
    }

    return {
      age,
      sex,
      work_blocks: workBlocks,
    };
  }

  function collectReverseFormData() {
    // Collect retirement planning data
    const age = parseInt(document.getElementById("age-rev")?.value) || 30;
    const sex =
      document.querySelector('input[name="sex-rev"]:checked')?.value || "m";
    const expectedRetirementIncome =
      parseFloat(document.getElementById("goal-income")?.value) || 0;
    const funds =
      parseFloat(document.getElementById("current-savings")?.value) || 0;
    const expectedRetirementAge =
      parseInt(document.getElementById("retirement-age")?.value) || 67;
    const includeSick =
      document.getElementById("sick-leave-rev")?.checked || false;

    return {
      age,
      sex,
      expected_retirement_income: expectedRetirementIncome,
      include_sick: includeSick,
      funds,
      start_year: new Date().getFullYear(),
      expected_retirement_age: expectedRetirementAge,
    };
  }

  /**
   * Results Display Functions
   */

  function displayForwardResults(results) {
    // Update pension calculation results
    updateElement(
      "actual-pension",
      formatCurrency(results.actual_retirement_income)
    );
    updateElement(
      "real-pension",
      formatCurrency(results.realistic_retirement_income)
    );

    // Calculate replacement rate if salary data available
    const salary = parseFloat(document.getElementById("salary")?.value) || 1;
    const replacementRate = (
      (results.realistic_retirement_income / salary) *
      100
    ).toFixed(1);
    updateElement("replacement-rate", `${replacementRate}%`);

    // Comparison with average
    const avgPension = 2500; // PLN average pension estimate
    const vsAverage =
      results.realistic_retirement_income > avgPension
        ? "Powyżej średniej krajowej"
        : "Poniżej średniej krajowej";
    updateElement("average-comparison", vsAverage);

    showSuccess(
      `Obliczenia zakończone! Twoja przewidywana emerytura to ${formatCurrency(
        results.realistic_retirement_income
      )}.`
    );
  }

  function displayReverseResults(results) {
    // Update retirement plan results
    updateElement("goal-value", formatCurrency(results.expected_total_funds));
    updateElement("funds-left", formatCurrency(results.funds_left_to_collect));

    // Calculate monthly savings needed
    const currentAge =
      parseInt(document.getElementById("age-rev")?.value) || 30;
    const retirementAge =
      parseInt(document.getElementById("retirement-age")?.value) || 67;
    const yearsLeft = retirementAge - currentAge;
    const monthlyNeeded = results.funds_left_to_collect / (yearsLeft * 12);

    updateElement("monthly-savings", formatCurrency(monthlyNeeded));

    showSuccess(
      `Plan emerytalny wygenerowany! Musisz oszczędzać ${formatCurrency(
        monthlyNeeded
      )} miesięcznie.`
    );
  }

  /**
   * UI Helper Functions
   */

  function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }

  function setLoadingState(isLoading) {
    const submitButtons = document.querySelectorAll(
      'button[type="submit"], .next-btn'
    );
    submitButtons.forEach((button) => {
      button.disabled = isLoading;
      button.textContent = isLoading
        ? "Obliczanie..."
        : button.dataset.originalText || "Oblicz";
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }
    });

    if (isLoading) {
      showInfo("Obliczenia w toku... Proszę czekać.");
    } else {
      clearMessages();
    }
  }

  function showError(message) {
    showMessage(message, "error");
  }

  function showSuccess(message) {
    showMessage(message, "success");
  }

  function showInfo(message) {
    showMessage(message, "info");
  }

  function showMessage(message, type) {
    clearMessages();

    const messageDiv = document.createElement("div");
    messageDiv.className = `calculator-message ${type}`;
    messageDiv.innerHTML = `
      <span class="message-icon">${getMessageIcon(type)}</span>
      <span class="message-text">${message}</span>
    `;

    // Styling
    messageDiv.style.cssText = `
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: ${getMessageColor(type, "bg")};
      color: ${getMessageColor(type, "text")};
      border: 1px solid ${getMessageColor(type, "border")};
      animation: slideDown 0.3s ease-out;
    `;

    const container =
      stepperForm.querySelector(".accordion-step.active") || stepperForm;
    container.insertBefore(messageDiv, container.firstChild);

    // Auto-remove after delay for info messages
    if (type === "info") {
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 3000);
    }
  }

  function clearMessages() {
    document
      .querySelectorAll(".calculator-message")
      .forEach((msg) => msg.remove());
  }

  function clearResults() {
    // Clear any existing results
    const resultElements = [
      "actual-pension",
      "real-pension",
      "replacement-rate",
      "average-comparison",
      "goal-value",
      "funds-left",
      "monthly-savings",
    ];
    resultElements.forEach((id) => updateElement(id, "---"));
  }

  function getMessageIcon(type) {
    switch (type) {
      case "error":
        return "⚠️";
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  }

  function getMessageColor(type, variant) {
    const colors = {
      error: { bg: "#fee2e2", text: "#dc2626", border: "#fecaca" },
      success: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
      info: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
    };
    return colors[type]?.[variant] || colors.info[variant];
  }

  function formatCurrency(value) {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  }

  // Start Over functionality
  const startOverBtns = document.querySelectorAll(
    "#start-over-btn, #start-over-btn-rev"
  );
  startOverBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeSelection.style.display = "block";
      stepperForm.style.display = "none";
      resetCalculator();
    });
  });

  // Add custom CSS for animations and styling
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideDown {
      from { 
        opacity: 0; 
        transform: translateY(-20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    .accordion-step.unlocked .step-header {
      cursor: pointer;
    }
    
    .accordion-step.active .step-header {
      background-color: rgba(24, 91, 58, 0.1);
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);

  console.log("✅ Calculator integration loaded successfully");

  // MOCK CALCULATION FUNCTIONS (Simplified for demonstration)
  function calculateForwardPension(customEndYear = null) {
    const age = parseInt(document.getElementById("age").value) || 0;
    const grossSalary =
      parseFloat(document.getElementById("salary").value) || 0;
    const startYear =
      parseInt(document.getElementById("start-year").value) || 0;
    const endYear =
      customEndYear || parseInt(document.getElementById("end-year").value) || 0;
    const accumulated =
      parseFloat(document.getElementById("accumulated").value) || 0;
    const sickLeave = document.getElementById("sick-leave").checked;
    const pensionGoal =
      parseFloat(document.getElementById("pension-goal").value) || 0;

    const workYears = endYear - startYear;
    if (workYears <= 0) return 0;

    let yearlyContribution = grossSalary * 12 * 0.1952; // ZUS contribution rate
    let totalContribution = accumulated + yearlyContribution * workYears;

    if (sickLeave) totalContribution *= 0.98; // Small penalty for sick leave

    // Polish life expectancy is ~210 months at retirement
    const actual = totalContribution / 210;

    if (customEndYear) return actual; // Return only the value for delay calculation

    // For the main result, calculate all metrics
    const real = actual * 0.7; // Mock inflation adjustment
    const replacementRate = ((actual / grossSalary) * 100).toFixed(1);
    const averagePension = 2500; // Mock average
    const vsAverage =
      actual > averagePension ? "Powyżej prognozy" : "Poniżej prognozy";

    let workLongerYears = 0;
    if (pensionGoal > 0 && actual < pensionGoal) {
      let tempPension = actual;
      let tempEndYear = endYear;
      while (tempPension < pensionGoal && workLongerYears < 20) {
        workLongerYears++;
        tempEndYear++;
        tempPension = calculateForwardPension(tempEndYear);
      }
    }

    return {
      actual,
      real,
      replacementRate,
      vsAverage,
      delay1: calculateForwardPension(endYear + 1),
      delay2: calculateForwardPension(endYear + 2),
      delay5: calculateForwardPension(endYear + 5),
      workLongerYears,
    };
  }

  function calculateReversePension() {
    const goal =
      parseFloat(document.getElementById("desired-pension").value) || 0;
    const age = parseInt(document.getElementById("rev-age").value) || 0;
    const retirementAge =
      parseInt(document.getElementById("rev-retirement-age").value) || 0;

    const workYears = retirementAge - age;
    if (workYears <= 0) return { goal, requiredSalary: 0 };

    const requiredTotalContribution = goal * 210; // Reverse the life expectancy division
    const requiredYearlyContribution = requiredTotalContribution / workYears;
    const requiredSalary = requiredYearlyContribution / 12 / 0.1952;

    return { goal, requiredSalary };
  }

  function formatCurrency(value) {
    return (value || 0).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });
  }
});
