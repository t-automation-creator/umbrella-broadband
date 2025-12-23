import { Link } from "wouter";

export default function Hero() {
  return (
    <section 
      className="relative text-white min-h-[600px] lg:min-h-[700px] flex items-center"
      style={{
        backgroundImage: "url('/images/hero-aerial-v4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center right",
      }}
    >
      {/* Very subtle gradient overlay for text readability on left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/70 from-0% via-primary/40 via-25% to-transparent to-40%" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-32 w-full">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight font-heading" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Fully Managed Broadband, VoIP & Security Solutions
          </h1>
          <p className="text-lg lg:text-xl text-gray-200 mb-8 font-sans" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            Fast, reliable, and secure connectivity with full network management for landlords, businesses, and developers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/solutions">
              <span className="btn btn-primary cursor-pointer">Our Solutions</span>
            </Link>
            <Link href="/contact">
              <span className="btn btn-outline-white cursor-pointer">Get in Touch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
