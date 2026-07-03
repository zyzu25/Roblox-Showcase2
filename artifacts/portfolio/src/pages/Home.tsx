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
import { BackgroundSwitcher } from "@/components/BackgroundSwitcher";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AmbientAudio } from "@/components/AmbientAudio";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ToolShowcase } from "@/components/ToolShowcase";
import { IdleAnimation } from "@/components/IdleAnimation";
import { ReturnGreeting } from "@/components/ReturnGreeting";
import { StreakDisplay } from "@/components/StreakDisplay";
import { ImportingSection } from "@/components/ImportingSection";
import { ThemeNudgePopup } from "@/components/ThemeNudgePopup";
import { SupportSection } from "@/components/SupportSection";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />
      <BackgroundSwitcher />
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
        <SupportSection />
        <Portfolio />
        <WhyChooseUs />
        <Process />
        <ToolShowcase />
        <Services />
        <Pricing />
        <ImportingSection />
        <Policies />
        <RevisionPolicy />
        <PromoSection />
        <Testimonials />
        <ReviewsSection />
        <FAQ />
        <Contact />
        <Footer />
      </main>
      <StickyPill />
      <PriceCalculator />
      <StyleQuiz />
      <IdleAnimation />
      <ReturnGreeting />
      <StreakDisplay />
      <ThemeNudgePopup />
    </>
  );
}
