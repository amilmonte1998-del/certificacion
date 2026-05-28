import { Navbar, Footer } from "@/components/navigation";
import {
  HeroSection,
  HowItWorksSection,
  FeaturesSection,
  CTASection,
} from "@/components/landing-sections";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
