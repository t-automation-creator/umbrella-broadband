import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Wifi, Shield, Clock, Headphones, BarChart3, Settings, CheckCircle2, Zap, Globe, Server, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ManagedBroadband() {
  const features = [
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "High-Speed Connectivity",
      description: "Fibre, leased lines, and wireless solutions delivering speeds from 100Mbps to 10Gbps, tailored to your needs."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Built-in firewall, intrusion detection, content filtering, and VPN capabilities to protect your network."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Monitoring",
      description: "Our Network Operations Centre monitors your connection around the clock, resolving issues before they impact you."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Real-time dashboards showing bandwidth usage, network health, and performance metrics at your fingertips."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Priority Support",
      description: "Dedicated account management and rapid-response technical support with guaranteed SLAs."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Fully Managed",
      description: "We handle everything from installation to maintenance, firmware updates, and capacity planning."
    }
  ];

  const benefits = [
    "Guaranteed uptime SLAs (up to 99.99%)",
    "Automatic failover to backup connections",
    "Scalable bandwidth on demand",
    "No capital expenditure on equipment",
    "Single point of contact for all issues",
    "Proactive maintenance and updates",
    "Detailed monthly reporting",
    "UK-based support team"
  ];

  const sectors = [
    {
      title: "Student Accommodation",
      description: "High-density WiFi for hundreds of users with fair usage policies and content filtering."
    },
    {
      title: "HMO Properties",
      description: "Shared internet solutions with individual billing options and room-level access control."
    },
    {
      title: "Commercial Buildings",
      description: "Business-grade connectivity with dedicated bandwidth and priority traffic management."
    },
    {
      title: "Residential Developments",
      description: "Future-proof infrastructure with fibre-to-the-unit and managed WiFi options."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Managed Broadband | Umbrella Broadband" 
        description="Fully managed broadband for businesses and landlords. High-speed fibre, 24/7 monitoring, and dedicated UK support."
        keywords="managed broadband UK, business internet, landlord broadband, HMO internet, managed WiFi, fibre broadband"
        image="/images/solutions/broadband-hero-desktop.jpg"
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center text-white overflow-hidden">
          {/* Background Image */}
          <picture className="absolute inset-0">
            <source media="(min-width: 768px)" srcSet="/images/solutions/broadband-hero-desktop.jpg" />
            <img loading="lazy" src="/images/solutions/broadband-hero-mobile.jpg" 
              alt="Managed Broadband Solutions" 
              className="w-full h-full object-cover"
            />
          </picture>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12 md:pt-20 md:pb-20 lg:pt-32 lg:pb-32 w-full">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Wifi className="w-4 h-4" />
                Connectivity Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-heading leading-tight drop-shadow-lg">
                Managed<br />
                <span className="text-secondary">Broadband</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
                High-speed, reliable internet connectivity that's fully managed 24/7. 
                We ensure optimal performance and seamless coverage so you can focus on what matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn bg-secondary hover:bg-secondary/90 text-white px-8 py-3 text-center">
                  Get a Quote
                </Link>
                <a href="tel:01926298866" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 text-center backdrop-blur-sm">
                  Call 01926 298866
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Complete Managed Connectivity
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                More than just an internet connection. Our managed broadband service includes everything 
                you need for reliable, secure, high-performance connectivity.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 font-heading">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6 font-heading">
                  Why Choose Managed Broadband?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Stop worrying about your internet connection. With our fully managed service, 
                  you get enterprise-grade connectivity with the peace of mind that comes from 
                  knowing experts are handling everything behind the scenes.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-6 font-heading">Connection Options</h3>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-secondary flex-shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">FTTP/FTTC Fibre</h4>
                      <p className="text-gray-600 text-sm">Up to 1Gbps symmetric speeds with low latency. Ideal for most business applications.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-secondary flex-shrink-0">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">Leased Lines</h4>
                      <p className="text-gray-600 text-sm">Dedicated, uncontended bandwidth from 100Mbps to 10Gbps with guaranteed SLAs.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-secondary flex-shrink-0">
                      <Wifi className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">Fixed Wireless</h4>
                      <p className="text-gray-600 text-sm">Point-to-point wireless for locations where fibre isn't available. Rapid deployment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sectors Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Tailored for Your Sector
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We understand that different properties have different connectivity needs. 
                Our solutions are designed with your specific requirements in mind.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectors.map((sector, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-secondary/30 hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold text-primary mb-2 font-heading">{sector.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{sector.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-primary rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6 font-heading">Ready to Get Connected?</h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Let us design a managed broadband solution that meets your specific needs. 
                Get in touch for a free consultation and quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn bg-secondary hover:bg-secondary/90 text-white px-8 py-3 inline-flex items-center justify-center gap-2">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/solutions" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3">
                  View All Solutions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
