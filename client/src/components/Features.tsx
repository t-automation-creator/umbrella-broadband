import { Wifi, ShieldCheck, Settings, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4 font-heading">Comprehensive Connectivity</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-sans">
            We specialize in designing, installing, and managing network infrastructure with a focus on reliability and security.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 justify-center">
          {/* Feature 1 */}
          <Link href="/managed-broadband">
            <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-all border border-gray-100 cursor-pointer group h-full">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <Wifi className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-heading">Managed Wi-Fi</h3>
              <p className="text-gray-600 font-sans mb-4">
                Custom network design and structured cabling ensuring seamless coverage across all properties.
              </p>
              <span className="inline-flex items-center text-secondary font-medium group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </Link>

          {/* Feature 2 */}
          <Link href="/cctv">
            <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-all border border-gray-100 cursor-pointer group h-full">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-heading">Security Systems</h3>
              <p className="text-gray-600 font-sans mb-4">
                Integrated CCTV, Access Control, and Video Intercom solutions to protect your assets.
              </p>
              <span className="inline-flex items-center text-secondary font-medium group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </Link>

          {/* Feature 3 */}
          <Link href="/solutions">
            <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-all border border-gray-100 cursor-pointer group h-full">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-heading">Management Services</h3>
              <p className="text-gray-600 font-sans mb-4">
                Proactive monitoring, maintenance, and support for all your connectivity and security infrastructure.
              </p>
              <span className="inline-flex items-center text-secondary font-medium group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
