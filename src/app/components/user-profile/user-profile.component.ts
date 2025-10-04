import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  simulationHistory = [
    { date: "2024-10-01", pension: 3200, status: "Ukończona" },
    { date: "2024-09-28", pension: 2950, status: "Ukończona" },
    { date: "2024-09-25", pension: 3100, status: "Ukończona" },
  ];

  userStats = {
    simulationsCount: 12,
    averagePension: 3083,
    lastSimulation: "2024-10-01",
  };

  constructor(private formBuilder: FormBuilder) {
    this.profileForm = this.formBuilder.group({
      firstName: ["Jan", Validators.required],
      lastName: ["Kowalski", Validators.required],
      email: [
        "jan.kowalski@email.com",
        [Validators.required, Validators.email],
      ],
      phone: ["+48 123 456 789"],
      birthDate: ["1985-03-15", Validators.required],
      currentSalary: [5500, [Validators.required, Validators.min(0)]],
      workStartYear: [2008, [Validators.required, Validators.min(1980)]],
      plannedRetirementYear: [2050, Validators.required],
    });
  }

  ngOnInit() {
    this.profileForm.disable();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      // Simulate saving to backend
      console.log("Saving profile:", this.profileForm.value);
      this.toggleEdit();
      // Show success message
    }
  }

  cancelEdit() {
    this.profileForm.reset();
    this.toggleEdit();
  }

  downloadReport() {
    // Simulate report download
    console.log("Downloading pension report...");
  }

  deleteSimulation(index: number) {
    this.simulationHistory.splice(index, 1);
  }
}
