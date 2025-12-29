import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Sectors from "@/components/Sectors";
import AnimatedStats from "@/components/AnimatedStats";
import Partners from "@/components/Partners";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CaseStudyPreview from "@/components/CaseStudyPreview";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SEO 
        title="Umbrella Broadband | Managed Connectivity" 
        description="Umbrella Broadband provides fast, reliable, and secure connectivity solutions for landlords, businesses, and developers. Fully managed networks you can trust."
        keywords="managed broadband UK, business internet solutions, HMO WiFi, student accommodation broadband, VoIP phone systems, CCTV security"
        image="/images/hero-aerial-v14.jpg"
      />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Sectors />
        <AnimatedStats />
        <Partners />
        <CaseStudyPreview />
        <TestimonialsCarousel />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
