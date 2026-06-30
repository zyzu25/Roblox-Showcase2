import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClientStrip } from "@/components/ClientStrip";
import { About } from "@/components/About";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Policies } from "@/components/Policies";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { StickyPill } from "@/components/StickyPill";
import { PriceCalculator } from "@/components/PriceCalculator";
import { StyleQuiz } from "@/components/StyleQuiz";
import { PromoSection } from "@/components/PromoSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Process } from "@/components/Process";
import { RevisionPolicy } from "@/components/RevisionPolicy";
import { GlobalBackground } from "@/components/GlobalBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AmbientAudio } from "@/components/AmbientAudio";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />
      <GlobalBackground />
      <ScrollProgress />
      <AmbientAudio />
      <main
        className="relative min-h-screen text-foreground overflow-x-hidden"
        style={{
          background: "transparent",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.7s ease",
          pointerEvents: loaded ? "auto" : "none",
        }}
      >
        <Navbar />
        <Hero />
        <ClientStrip />
        <About />
        <Portfolio />
        <WhyChooseUs />
        <Process />
        <Services />
        <Pricing />
        <RevisionPolicy />
        <PromoSection />
        <Testimonials />
        <ReviewsSection />
        <Policies />
        <FAQ />
        <Contact />
        <Footer />
      </main>
      <StickyPill />
      <PriceCalculator />
      <StyleQuiz />
    </>
  );
}
