import { Wifi, ShieldCheck, Settings, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4 font-heading">A Technology Partner You Can Rely On for Every Property</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-sans">
            We specialize in designing, installing, and managing connectivity and security technologies across your properties, with a focus on reliability, security, and long-term support.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 justify-center">
          {/* Feature 1 */}
          <Link href="/managed-broadband">
            <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-all border border-gray-100 cursor-pointer group h-full">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <Wifi className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-heading">Connectivity Solutions</h3>
              <p className="text-gray-600 font-sans mb-4">
                End-to-end broadband, VoIP, and Wi-Fi solutions with custom network design and structured cabling for seamless coverage.
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
              <h3 className="text-xl font-bold text-primary mb-3 font-heading">Security & Surveillance</h3>
              <p className="text-gray-600 font-sans mb-4">
                Comprehensive CCTV, Access Control, and Video Intercom systems designed to protect your properties and tenants.
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
              <h3 className="text-xl font-bold text-primary mb-3 font-heading">Ongoing Support & Management</h3>
              <p className="text-gray-600 font-sans mb-4">
                24/7 monitoring, proactive maintenance, and dedicated UK-based support for all your technology infrastructure.
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
