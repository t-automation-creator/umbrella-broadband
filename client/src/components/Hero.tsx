import { Link } from "wouter";

export default function Hero() {
  return (
    <section 
      className="relative text-white min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center bg-cover bg-[center_left_-200px] md:bg-center"
      style={{
        backgroundImage: "url('/images/hero-aerial-v8.png')",
      }}
    >
      {/* Gradient overlay - stronger on mobile for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40 md:from-primary/70 md:from-0% md:via-primary/40 md:via-25% md:to-transparent md:to-40%" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20 lg:py-32 w-full">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight font-heading" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.6)' }}>
            Fully Managed <span className="whitespace-nowrap">Broadband, VoIP &</span><br />Security Solutions
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8 font-sans" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.7), 0 4px 30px rgba(0,0,0,0.5)' }}>
            Fast, reliable, and secure connectivity with full network management for landlords, businesses, and developers.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link href="/solutions">
              <span className="btn btn-primary cursor-pointer text-sm md:text-base">Our Solutions</span>
            </Link>
            <Link href="/contact">
              <span className="btn btn-outline-white cursor-pointer text-sm md:text-base">Get in Touch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
