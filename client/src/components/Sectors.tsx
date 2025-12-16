import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Sectors() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img 
              src="https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_Landlords_Hero.png" 
              alt="Building Connectivity" 
              className="rounded-2xl shadow-xl w-full" 
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-primary mb-6 font-heading">Tailored for Your Sector</h2>
            <p className="text-gray-600 mb-6 font-sans">
              Whether you manage student accommodation, commercial offices, or residential developments, we provide bespoke network solutions that scale.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Landlords & HMOs",
                "Property Developers",
                "SME Businesses",
                "Purpose Built Student Blocks"
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700 font-sans">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/sectors">
              <span className="btn btn-primary cursor-pointer">Explore Sectors</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
