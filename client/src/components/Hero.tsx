import { Link } from "wouter";

export default function Hero() {
  return (
    <section 
      className="relative text-white min-h-[600px] lg:min-h-[700px] flex items-center"
      style={{
        backgroundImage: "url('/images/hero-aerial-v3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center right",
      }}
    >
      {/* Dark gradient overlay for text readability on left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary from-0% via-primary/80 via-30% to-transparent to-50%" />
      {/* Bottom gradient for smoother blend into next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/90 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-32 w-full">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight font-heading">
            Fully Managed Broadband, VoIP & Security Solutions
          </h1>
          <p className="text-lg lg:text-xl text-gray-200 mb-8 font-sans">
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
