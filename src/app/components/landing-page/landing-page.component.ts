import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  scrollY = 0;
  windowHeight = 0;

  didYouKnowFacts = [
    "Średnia emerytura w Polsce wynosi około 2,500 zł brutto miesięcznie.",
    "Składka emerytalna to 19,52% wynagrodzenia brutto, z czego 9,76% przekazuje pracodawca.",
    "Minimalna emerytura w 2024 roku to 1,588.44 zł brutto.",
    "Kapitał początkowy wpływa na wysokość emerytury - im wyższy, tym wyższa emerytura.",
    "Kobiety mogą przejść na emeryturę w wieku 60 lat, mężczyźni w wieku 65 lat.",
  ];

  currentFact = "";

  // Animation states
  heroVisible = false;
  featuresVisible = false;
  didYouKnowVisible = false;
  ctaVisible = false;

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngOnInit() {
    this.getRandomFact();
    this.windowHeight = window.innerHeight;
    this.heroVisible = true; // Hero starts visible
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.scrollY = window.scrollY;
    this.updateParallaxElements();
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.windowHeight = window.innerHeight;
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          if (target.id === "features") {
            this.featuresVisible = true;
          } else if (target.id === "did-you-know") {
            this.didYouKnowVisible = true;
          } else if (target.id === "cta") {
            this.ctaVisible = true;
          }
        }
      });
    }, options);

    // Observe sections
    const sections = ["features", "did-you-know", "cta"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
  }

  updateParallaxElements() {
    const scrollFactor = this.scrollY / this.windowHeight;

    // Update parallax elements in the template
    const parallaxElements =
      this.elementRef.nativeElement.querySelectorAll(".parallax-bg");
    parallaxElements.forEach((element: HTMLElement, index: number) => {
      const speed = (index + 1) * 0.5;
      const yPos = -(this.scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  getRandomFact() {
    const randomIndex = Math.floor(Math.random() * this.didYouKnowFacts.length);
    this.currentFact = this.didYouKnowFacts[randomIndex];
  }

  startSimulation() {
    this.router.navigate(["/calculator"]);
  }

  learnMore() {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  }
}
