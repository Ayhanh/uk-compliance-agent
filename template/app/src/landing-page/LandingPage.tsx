import { FAQ } from "./components/FAQ";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { SchemaMarkup } from "./components/SchemaMarkup";
import { faqs, features, footerNavigation } from "./contentSections";

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <SchemaMarkup />
      <main className="isolate">
        <Hero />
        <HowItWorks />
        <FeaturesGrid features={features} />
        <FAQ faqs={faqs} />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
