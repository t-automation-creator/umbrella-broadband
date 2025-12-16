import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative bg-primary text-white py-20 lg:py-32">
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
            src="https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_Hero4.png" 
            alt="Connectivity Infrastructure" 
            className="w-full max-w-lg object-contain drop-shadow-2xl" 
          />
        </div>
      </div>
    </section>
  );
}
