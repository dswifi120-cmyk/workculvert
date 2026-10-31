import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Ticker } from "@/components/landing/ticker";
import { Stats } from "@/components/landing/stats";
import { Categories } from "@/components/landing/categories";
import { How } from "@/components/landing/how";
import { JobsSection } from "@/components/landing/jobs";
import { Why } from "@/components/landing/why";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Ticker />
      <Stats />
      <Categories />
      <How />
      <JobsSection />
      <Why />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
