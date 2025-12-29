import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Wifi, ShieldCheck, Phone, Lock, Satellite, Settings, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Solutions() {
  const solutions = [
    {
      icon: <Wifi className="w-10 h-10" />,
      title: "Managed Broadband",
      description: "High-speed, reliable internet connectivity managed 24/7. We ensure optimal performance and seamless coverage for all users.",
      link: "/managed-broadband"
    },
    {
      icon: <Phone className="w-10 h-10" />,
      title: "VoIP Phone Systems",
      description: "Cost-effective, feature-rich cloud phone systems that keep your business connected anywhere, on any device.",
      link: "/voip"
    },
    {
      icon: <ShieldCheck className="w-10 h-10" />,
      title: "CCTV & Security",
      description: "Advanced surveillance systems with remote monitoring capabilities to protect your premises and assets around the clock.",
      link: "/cctv"
    },
    {
      icon: <Lock className="w-10 h-10" />,
      title: "Access Control Solutions",
      description: "Secure, keyless entry systems for buildings and rooms, fully integrated with our network infrastructure for easy management.",
      link: "/access-control"
    },
    {
      icon: <Satellite className="w-10 h-10" />,
      title: "Managed Starlink",
      description: "High-speed satellite internet for rural and hard-to-reach locations, fully managed with professional installation and support.",
      link: "/starlink"
    },
    {
      icon: <Settings className="w-10 h-10" />,
      title: "Management Services",
      description: "Comprehensive support and maintenance for all your systems. 24/7 monitoring, proactive maintenance, and SLA-backed support.",
      link: "/services"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Solutions | Umbrella Broadband" 
        description="Explore our comprehensive range of services including Managed Broadband, VoIP Telephony, CCTV Security, and Management Services."
        keywords="managed broadband, VoIP telephony, CCTV security, access control, business internet, network management"
      />
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">Our Solutions</h1>
            <p className="text-lg text-gray-200">
              Comprehensive technology services designed to keep you connected, secure, and ahead of the curve.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((item, index) => (
                <Link key={index} href={item.link}>
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-secondary/30 transition-all cursor-pointer group h-full">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary/10 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3 font-heading group-hover:text-secondary transition-colors">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-secondary font-medium group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-primary rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6 font-heading">Need a Custom Solution?</h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Every project is unique. Our team of experts will work with you to design a bespoke package that meets your specific requirements and budget.
              </p>
              <a href="/contact" className="btn bg-white text-primary hover:bg-gray-100">
                Get a Quote
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
