import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-calculator-page",
  templateUrl: "./calculator-page.component.html",
  styleUrls: ["./calculator-page.component.scss"],
})
export class CalculatorPageComponent implements OnInit {
  calculatorForm: FormGroup;
  isCalculating = false;
  results: any = null;
  currentStep = 1;
  totalSteps = 3;
  Math = Math;

  constructor(private formBuilder: FormBuilder) {
    this.calculatorForm = this.formBuilder.group({
      // Step 1: Basic Information
      age: [30, [Validators.required, Validators.min(18), Validators.max(67)]],
      gender: ["male", Validators.required],
      currentSalary: [5000, [Validators.required, Validators.min(1000)]],

      // Step 2: Work History
      workStartYear: [2015, [Validators.required, Validators.min(1980)]],
      plannedRetirementAge: [
        65,
        [Validators.required, Validators.min(60), Validators.max(70)],
      ],

      // Step 3: Additional Options
      currentZUSFunds: [0, [Validators.min(0)]],
      includeSickLeave: [false],
      salaryGrowthRate: [3, [Validators.min(0), Validators.max(20)]],
      desiredPension: [3000, [Validators.min(1000)]],
    });
  }

  ngOnInit() {}

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  calculatePension() {
    if (this.calculatorForm.valid) {
      this.isCalculating = true;

      // Simulate API call for pension calculation
      setTimeout(() => {
        const formData = this.calculatorForm.value;
        this.results = this.simulatePensionCalculation(formData);
        this.isCalculating = false;
      }, 3000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.calculatorForm.controls).forEach((key) => {
        this.calculatorForm.get(key)?.markAsTouched();
      });
    }
  }

  simulatePensionCalculation(data: any) {
    // Simple pension calculation simulation
    const workYears =
      data.plannedRetirementAge - (2024 - (data.workStartYear - data.age + 30));
    const avgSalary =
      data.currentSalary * (1 + data.salaryGrowthRate / 100) ** (workYears / 2);
    const basePension = avgSalary * 0.4 * (workYears / 35);
    const totalPension = basePension + data.currentZUSFunds / 20;

    return {
      grossPension: Math.round(totalPension),
      netPension: Math.round(totalPension * 0.88),
      replacementRate: Math.round((totalPension / avgSalary) * 100),
      workYears: workYears,
      averagePension: 2500,
      pensionComparison: Math.round(((totalPension - 2500) / 2500) * 100),
      delayBenefits: {
        oneYear: Math.round(totalPension * 1.06),
        twoYears: Math.round(totalPension * 1.12),
        fiveYears: Math.round(totalPension * 1.3),
      },
    };
  }

  resetForm() {
    this.calculatorForm.reset();
    this.results = null;
    this.currentStep = 1;
  }

  saveSimulation() {
    // Save simulation to user profile/history
    console.log("Saving simulation:", this.results);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.calculatorForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"]) {
        return "To pole jest wymagane";
      }
      if (control.errors["min"]) {
        return `Minimalna wartość to ${control.errors["min"].min}`;
      }
      if (control.errors["max"]) {
        return `Maksymalna wartość to ${control.errors["max"].max}`;
      }
    }
    return "";
  }
}
