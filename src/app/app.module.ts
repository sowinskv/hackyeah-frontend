import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { AuthPageComponent } from "./components/auth-page/auth-page.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { CalculatorPageComponent } from "./components/calculator-page/calculator-page.component";
import { NavigationComponent } from "./components/navigation/navigation.component";

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AuthPageComponent,
    UserProfileComponent,
    CalculatorPageComponent,
    NavigationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
