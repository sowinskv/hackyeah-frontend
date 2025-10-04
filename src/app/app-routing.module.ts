import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { AuthPageComponent } from "./components/auth-page/auth-page.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { CalculatorPageComponent } from "./components/calculator-page/calculator-page.component";

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "auth", component: AuthPageComponent },
  { path: "profile", component: UserProfileComponent },
  { path: "calculator", component: CalculatorPageComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
