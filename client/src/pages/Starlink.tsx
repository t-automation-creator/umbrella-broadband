import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Satellite, Zap, MapPin, Building2, Calendar, Truck, Shield, Clock, Headphones, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Starlink() {
  const useCases = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Emergency & Backup Internet",
      description: "Rapid deployment when your primary connection fails. Get back online within hours, not days. Perfect for business continuity planning."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Rural & Remote Locations",
      description: "High-speed connectivity where traditional broadband can't reach. Ideal for farms, countryside businesses, and areas with poor infrastructure."
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Construction Sites",
      description: "Temporary high-speed internet for project sites. Enable real-time collaboration, security cameras, and site management tools from day one."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Events & Pop-Up Venues",
      description: "Reliable connectivity for festivals, conferences, weddings, and outdoor events. Professional-grade internet wherever you need it."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Mobile Operations",
      description: "Stay connected on the move. Perfect for mobile offices, fleet vehicles, boats, and temporary command centres."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Business Continuity",
      description: "Automatic failover when your main connection drops. Ensure your business never goes offline with satellite backup."
    }
  ];

  const features = [
    "Speeds up to 220 Mbps download",
    "Low latency (typically 25-50ms)",
    "Unlimited data with no throttling",
    "Professional installation included",
    "24/7 monitoring and support",
    "Rapid deployment (often same-day)",
    "Flexible rental or purchase options",
    "Multi-site management dashboard",
    "Automatic failover configuration",
    "Weather-resistant equipment"
  ];

  const managedServices = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Monitoring",
      description: "Our NOC monitors your connection around the clock, proactively addressing issues before they impact your business."
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Priority Support",
      description: "Direct access to our technical team with guaranteed response times. We're here when you need us."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Managed Security",
      description: "Enterprise-grade firewall, VPN configuration, and network security included as standard."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Managed Starlink Services | Umbrella Broadband" 
        description="Professional Starlink installation and management for UK businesses. Emergency backup, rural connectivity, and events with 24/7 support."
        keywords="managed Starlink UK, Starlink business internet, emergency backup internet, rural broadband, satellite internet, Starlink installation"
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center text-white overflow-hidden">
          {/* Background Image */}
          <picture className="absolute inset-0">
            <source media="(min-width: 768px)" srcSet="/images/solutions/starlink-hero-desktop.jpg" />
            <img loading="lazy" src="/images/solutions/starlink-hero-mobile.jpg" 
              alt="Managed Starlink Services" 
              className="w-full h-full object-cover"
            />
          </picture>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/70 to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12 md:pt-20 md:pb-20 lg:pt-32 lg:pb-32 w-full">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Satellite className="w-4 h-4" />
                Satellite Internet Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-heading leading-tight drop-shadow-lg">
                Managed Starlink<br />
                <span className="text-cyan-400">Services</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
                High-speed satellite internet, professionally installed and fully managed. 
                Connect anywhere in the UK with speeds up to 220 Mbps and 24/7 expert support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-center">
                  Get a Quote
                </Link>
                <a href="tel:01926298866" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 text-center backdrop-blur-sm">
                  Call 01926 298866
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Connectivity Solutions for Every Scenario
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From emergency backup to permanent rural installations, our managed Starlink service 
                delivers reliable high-speed internet wherever you need it.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
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

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6 font-heading">
                  Enterprise-Grade Satellite Internet
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Starlink's low-earth orbit satellite constellation delivers speeds and latency 
                  that rival traditional broadband. Combined with our professional management, 
                  you get a reliable, hassle-free connectivity solution.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-6 font-heading">What's Included</h3>
                <div className="space-y-6">
                  {managedServices.map((service, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600 flex-shrink-0">
                        {service.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary mb-1">{service.title}</h4>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From initial consultation to ongoing support, we handle everything so you can focus on your business.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Consultation", desc: "We assess your requirements, location, and use case to recommend the best solution." },
                { step: "2", title: "Site Survey", desc: "Our engineers check for clear sky view and optimal dish placement." },
                { step: "3", title: "Installation", desc: "Professional installation with weatherproof mounting and cable management." },
                { step: "4", title: "Ongoing Support", desc: "24/7 monitoring, maintenance, and priority technical support." }
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-cyan-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gray-300" />
                  )}
                  <h3 className="text-xl font-bold text-primary mb-3 font-heading">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Indication */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-[#0d2847] rounded-2xl p-12 text-white">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-heading">
                    Flexible Options to Suit Your Needs
                  </h2>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    Whether you need a permanent installation or short-term rental for an event or project, 
                    we offer flexible packages tailored to your requirements and budget.
                  </p>
                  <ul className="space-y-3 text-gray-200">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                      Monthly managed service from £99/month
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                      Short-term rental available (daily/weekly)
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                      Hardware purchase or lease options
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                      No long-term contracts required
                    </li>
                  </ul>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-gray-300 mb-4">Ready to get connected?</p>
                  <Link href="/contact" className="btn bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 text-lg inline-flex items-center gap-2">
                    Request a Quote
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <p className="text-sm text-gray-400 mt-4">
                    Or call us on <a href="tel:01926298866" className="text-cyan-400 hover:underline">01926 298866</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "How fast is Starlink?",
                  a: "Starlink typically delivers download speeds between 50-220 Mbps with latency of 25-50ms. This is fast enough for video conferencing, cloud applications, VoIP calls, and streaming."
                },
                {
                  q: "Does weather affect Starlink?",
                  a: "Heavy rain or snow can temporarily reduce speeds, but the system is designed to maintain connectivity in most weather conditions. Our managed service includes monitoring to alert you of any issues."
                },
                {
                  q: "How quickly can you install?",
                  a: "For emergency deployments, we can often install same-day or next-day. Standard installations are typically completed within 3-5 working days of order confirmation."
                },
                {
                  q: "Can Starlink work as a backup connection?",
                  a: "Yes, we can configure Starlink as an automatic failover for your primary connection. If your main broadband goes down, traffic seamlessly switches to Starlink."
                },
                {
                  q: "What do I need for installation?",
                  a: "You need a clear view of the sky (no major obstructions like tall buildings or trees) and a power source. Our engineers will assess your site and recommend the best mounting location."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-3">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-cyan-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-heading">
              Ready to Get Connected?
            </h2>
            <p className="text-lg text-cyan-100 mb-8 max-w-2xl mx-auto">
              Whether you need emergency backup, rural connectivity, or temporary internet for your next project, 
              we're here to help. Get in touch for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3">
                Contact Us
              </Link>
              <a href="tel:01926298866" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3">
                Call 01926 298866
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
