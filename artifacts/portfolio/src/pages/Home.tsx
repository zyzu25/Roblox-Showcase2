import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Policies } from "@/components/Policies";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { GlobalBackground } from "@/components/GlobalBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingParticles } from "@/components/FloatingParticles";

export default function Home() {
  return (
    <>
      <GlobalBackground />
      <FloatingParticles />
      <ScrollProgress />
      <main className="relative min-h-screen text-foreground overflow-x-hidden" style={{ background: 'transparent' }}>
        <Navbar />
        <Hero />
        <About />
        <Portfolio />
        <Services />
        <Pricing />
        <Testimonials />
        <Policies />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
