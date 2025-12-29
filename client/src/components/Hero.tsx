import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative text-white min-h-[600px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] 2xl:min-h-[900px] flex items-end md:items-center overflow-hidden">
      {/* Background images - mobile and desktop versions */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width: 768px)" srcSet="/images/hero-aerial-v14.jpg" />
        <source media="(max-width: 767px)" srcSet="/images/hero-aerial-mobile-v4.webp" type="image/webp" />
        <img 
          src="/images/hero-aerial-mobile-v4.jpg" 
          alt="Aerial view of UK town with connected properties"
          className="w-full h-full object-cover object-top md:object-top"
        />
      </picture>
      
      {/* Gradient overlay - bottom gradient on mobile, left gradient on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent md:bg-gradient-to-r md:from-primary/70 md:from-0% md:via-primary/40 md:via-25% md:to-transparent md:to-40%" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12 md:pt-20 md:pb-20 lg:pt-[228px] lg:pb-32 w-full">
        <div className="max-w-xl">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-6 leading-tight font-heading" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.6)' }}>
            Fully Managed <span className="whitespace-nowrap">Broadband, VoIP &</span><br />Security Solutions
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-200 mb-4 md:mb-8 font-sans" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.7), 0 4px 30px rgba(0,0,0,0.5)' }}>
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
