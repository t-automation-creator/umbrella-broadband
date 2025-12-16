import { Wifi, ShieldCheck, Settings } from "lucide-react";

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
          <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-secondary">
              <Wifi className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3 font-heading">Managed Wi-Fi</h3>
            <p className="text-gray-600 font-sans">
              Custom network design and structured cabling ensuring seamless coverage across all properties.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-secondary">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3 font-heading">Security Systems</h3>
            <p className="text-gray-600 font-sans">
              Integrated CCTV, Access Control, and Video Intercom solutions to protect your assets.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-secondary">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3 font-heading">Management Services</h3>
            <p className="text-gray-600 font-sans">
              Proactive monitoring, maintenance, and support for all your connectivity and security infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
