import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative bg-primary text-white pb-20 pt-10 lg:pb-32 lg:pt-16">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight font-heading">
            Fully Managed Broadband, VoIP & Security Solutions
          </h1>
          <p className="text-lg lg:text-xl text-gray-200 mb-8 max-w-lg font-sans">
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
        <div className="flex justify-center">
          <img 
            src="/images/hero-aerial.png" 
            alt="Property types connected by Umbrella Broadband solutions" 
            className="w-full max-w-2xl object-contain drop-shadow-2xl" 
          />
        </div>
      </div>
    </section>
  );
}
