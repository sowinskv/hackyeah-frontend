document.addEventListener("DOMContentLoaded", () => {
  const modeSelection = document.getElementById("mode-selection");
  const stepperForm = document.getElementById("stepper-form");
  const forwardModeBtn = document.getElementById("forward-mode-btn");
  const reverseModeBtn = document.getElementById("reverse-mode-btn");

  let calculatorMode = ""; // 'forward' or 'reverse'
  let currentStep = 0;
  let highestStepReached = 0;

  const startOverBtns = document.querySelectorAll(
    "#start-over-btn, #start-over-btn-rev"
  );

  // --- MODE SELECTION ---
  forwardModeBtn.addEventListener("click", () => setMode("forward"));
  reverseModeBtn.addEventListener("click", () => setMode("reverse"));

  function setMode(mode) {
    calculatorMode = mode;
    modeSelection.style.display = "none";
    stepperForm.style.display = "block";

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

  // --- EVENT LISTENERS ---
  stepperForm.addEventListener("click", (e) => {
    // Delegate events for all buttons
    if (e.target.matches(".next-btn")) handleNext();
    if (e.target.matches(".prev-btn")) handlePrev();
    if (e.target.matches("#start-over-btn, #start-over-btn-rev"))
      resetCalculator();
  });

  stepperForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (calculatorMode === "forward") {
      handleForwardSubmit();
    } else {
      handleReverseSubmit();
    }
  });

  function handleNext() {
    const currentStepElement = getActiveSteps()[currentStep];
    const inputs = [...currentStepElement.querySelectorAll("input[required]")];
    if (inputs.every((input) => input.reportValidity())) {
      currentStep++;
      if (currentStep > highestStepReached) highestStepReached = currentStep;
      updateSteps();
    }
  }

  function handlePrev() {
    currentStep--;
    updateSteps();
  }

  function resetCalculator() {
    currentStep = 0;
    highestStepReached = 0;
    stepperForm.reset();
    document.querySelectorAll(".accordion-step").forEach((step) => {
      step.classList.remove("unlocked", "active");
    });
    updateSteps();
  }

  // Dynamically add header click listeners
  document.querySelectorAll(".step-header").forEach((header) => {
    header.addEventListener("click", () => {
      const stepElement = header.closest(".accordion-step");
      if (stepElement.classList.contains("unlocked")) {
        currentStep = parseInt(stepElement.dataset.step);
        updateSteps();
      }
    });
  });

  // --- CALCULATION LOGIC ---
  function handleForwardSubmit() {
    const results = calculateForwardPension();

    // Populate results
    document.getElementById("actual-pension").textContent = formatCurrency(
      results.actual
    );
    document.getElementById("real-pension").textContent = formatCurrency(
      results.real
    );
    document.getElementById(
      "replacement-rate"
    ).textContent = `${results.replacementRate}%`;
    document.getElementById("average-comparison").textContent =
      results.vsAverage;
    document.getElementById("delay-1-year").textContent = formatCurrency(
      results.delay1
    );
    document.getElementById("delay-2-year").textContent = formatCurrency(
      results.delay2
    );
    document.getElementById("delay-5-year").textContent = formatCurrency(
      results.delay5
    );

    const workLongerEl = document.getElementById("work-longer-info");
    if (results.workLongerYears > 0) {
      workLongerEl.textContent = `Aby osiągnąć swój cel, musiałbyś pracować o ${results.workLongerYears} lat dłużej.`;
      workLongerEl.style.display = "block";
    } else {
      workLongerEl.style.display = "none";
    }

    currentStep++;
    if (currentStep > highestStepReached) highestStepReached = currentStep;
    updateSteps();
  }

  function handleReverseSubmit() {
    const results = calculateReversePension();
    document.getElementById("goal-value").textContent = formatCurrency(
      results.goal
    );
    document.getElementById("required-salary").textContent = formatCurrency(
      results.requiredSalary
    );

    currentStep++;
    if (currentStep > highestStepReached) highestStepReached = currentStep;
    updateSteps();
  }

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
