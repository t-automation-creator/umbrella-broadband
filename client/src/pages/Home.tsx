import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Sectors from "@/components/Sectors";
import Partners from "@/components/Partners";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SEO 
        title="Managed Broadband, VoIP & Security Solutions" 
        description="Umbrella Broadband provides fast, reliable, and secure connectivity solutions for landlords, businesses, and developers. Fully managed networks you can trust."
      />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Sectors />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
