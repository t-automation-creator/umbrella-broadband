import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="container relative z-10 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to upgrade your connectivity?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of businesses that trust Umbrella Broadband for their critical infrastructure needs.
            </p>
            <button className="bg-white text-background hover:bg-gray-100 font-bold py-4 px-10 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Get Started Today
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
