import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.scss"],
})
export class AuthPageComponent {
  isLoginMode = true;
  authForm: FormGroup;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.authForm = this.createForm();
  }

  createForm(): FormGroup {
    if (this.isLoginMode) {
      return this.formBuilder.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
      });
    } else {
      return this.formBuilder.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      });
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm = this.createForm();
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to profile or dashboard after successful auth
        this.router.navigate(["/profile"]);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.authForm.controls).forEach((key) => {
        this.authForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.authForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"]) {
        return "To pole jest wymagane";
      }
      if (control.errors["email"]) {
        return "Podaj prawidłowy adres email";
      }
      if (control.errors["minlength"]) {
        return "Hasło musi mieć co najmniej 6 znaków";
      }
    }
    return "";
  }
}
