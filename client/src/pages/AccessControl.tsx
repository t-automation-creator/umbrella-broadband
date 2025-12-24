import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { KeyRound, DoorOpen, Smartphone, Users, Shield, Clock, CheckCircle2, ArrowRight, Fingerprint, CreditCard, Video, Bell, Building, Home } from "lucide-react";
import { Link } from "wouter";

export default function AccessControl() {
  const features = [
    {
      icon: <KeyRound className="w-8 h-8" />,
      title: "Keyless Entry",
      description: "Eliminate the hassle of physical keys. Use fobs, cards, PIN codes, or smartphone apps for secure, convenient access."
    },
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Biometric Systems",
      description: "Fingerprint, facial recognition, and iris scanning for the highest level of security. Perfect for sensitive areas."
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Intercom",
      description: "See and speak to visitors before granting access. HD video with two-way audio and remote unlock capabilities."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Access",
      description: "Grant access remotely via smartphone app. Perfect for letting in deliveries, contractors, or guests when you're away."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time-Based Access",
      description: "Set schedules for when different users can enter. Restrict access by time of day, day of week, or specific dates."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Audit Trails",
      description: "Complete logs of who entered where and when. Essential for security compliance and incident investigation."
    }
  ];

  const benefits = [
    "Eliminate lost key problems",
    "Instantly revoke access when needed",
    "Track entry and exit times",
    "Integrate with CCTV systems",
    "Reduce insurance premiums",
    "Meet fire safety requirements",
    "Scalable from 1 to 1000+ doors",
    "Cloud-based management"
  ];

  const intercomTypes = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Door Stations",
      description: "HD camera with night vision, two-way audio, and weatherproof housing for main entrances."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Audio Intercoms",
      description: "Cost-effective voice communication for internal doors, gates, and secondary entrances."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "IP Intercoms",
      description: "Network-connected systems that forward calls to smartphones, tablets, or reception desks."
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Multi-Tenant Systems",
      description: "Directory-based intercoms for apartment buildings with individual unit calling and access control."
    }
  ];

  const accessTypes = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Proximity Cards & Fobs",
      description: "Simple tap-and-go access using RFID technology. Easy to issue, manage, and replace."
    },
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Biometric Readers",
      description: "Fingerprint and facial recognition for high-security areas where cards can be shared or lost."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Credentials",
      description: "Turn smartphones into access cards using Bluetooth or NFC. No physical credentials needed."
    },
    {
      icon: <KeyRound className="w-8 h-8" />,
      title: "PIN Keypads",
      description: "Numeric codes for areas where cards aren't practical. Support multiple user codes with audit trails."
    }
  ];

  const sectors = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Student Accommodation",
      description: "Secure building entry, room access, and common area management with student ID integration."
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "HMO Properties",
      description: "Individual room access with shared area controls. Perfect for landlords managing multiple tenants."
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Commercial Buildings",
      description: "Reception areas, office suites, server rooms, and car parks with visitor management."
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Residential Developments",
      description: "Communal entrances, parking barriers, and amenity access for apartment complexes."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Access Control Solutions | Umbrella Broadband" 
        description="Professional access control and intercom installation for businesses and landlords. Keyless entry, video intercoms, biometric systems, and mobile access. Secure your property with modern solutions."
        keywords="access control systems UK, video intercom installation, keyless entry systems, door entry systems, biometric access control, student accommodation access, HMO door entry, commercial access control, IP intercom systems"
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center text-white overflow-hidden">
          {/* Background Image */}
          <picture className="absolute inset-0">
            <source media="(min-width: 768px)" srcSet="/images/solutions/access-control-hero-desktop.png" />
            <img 
              src="/images/solutions/access-control-hero-mobile.png" 
              alt="Access Control Solutions" 
              className="w-full h-full object-cover"
            />
          </picture>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/70 to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12 md:pt-20 md:pb-20 lg:pt-32 lg:pb-32 w-full">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <KeyRound className="w-4 h-4" />
                Security Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-heading leading-tight drop-shadow-lg">
                Access Control<br />
                <span className="text-amber-400">Solutions</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
                Control who enters your building with modern keyless entry and video intercom systems. 
                Manage access remotely, track entry logs, and enhance security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 text-center">
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
                Complete Access Management
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From simple door entry to complex multi-site access control, our solutions 
                give you complete control over who can enter your premises and when.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
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

        {/* Access Types Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Access Credential Options
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the right credential type for your security needs and user convenience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {accessTypes.map((type, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 font-heading">{type.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits & Intercom Types Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6 font-heading">
                  Why Upgrade Your Door Entry?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Traditional keys are a security risk - they can be copied, lost, or stolen. 
                  Modern access control gives you complete visibility and control over who 
                  enters your property, with the flexibility to manage access remotely.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-6 font-heading">Intercom Options</h3>
                <div className="space-y-6">
                  {intercomTypes.map((intercom, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                        {intercom.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary mb-1">{intercom.title}</h4>
                        <p className="text-gray-600 text-sm">{intercom.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sectors Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Solutions for Every Property Type
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We design access control systems tailored to your specific property 
                requirements and user needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectors.map((sector, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                    {sector.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 font-heading">{sector.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{sector.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] rounded-2xl p-12 text-white">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 font-heading">Integrated Security Solutions</h2>
                  <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                    Our access control systems integrate seamlessly with CCTV, intruder alarms, 
                    and fire safety systems for a comprehensive security solution.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      Automatic CCTV recording on door events
                    </li>
                    <li className="flex items-center gap-3 text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      Fire alarm integration for emergency egress
                    </li>
                    <li className="flex items-center gap-3 text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      Visitor management with photo ID
                    </li>
                    <li className="flex items-center gap-3 text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      Lift and barrier control integration
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="text-5xl font-bold text-amber-400 mb-2">100%</div>
                    <div className="text-gray-300">Cloud-Based Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-primary rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6 font-heading">Secure Your Property Today</h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Get a free site survey and quote for your access control and intercom requirements. 
                Our experts will design a solution that fits your needs and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 inline-flex items-center justify-center gap-2">
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
