import { Link } from "wouter";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Monitor,
  Wrench,
  Network,
  Settings,
  GraduationCap,
  Shield,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  FileSearch,
  TrendingUp,
  Headphones
} from "lucide-react";

const valueAddedServices = [
  {
    icon: Monitor,
    title: "24/7 Monitoring & Support",
    description: "Round-the-clock monitoring of your systems with proactive alerts and UK-based support. Issues are often resolved before you even notice them.",
    features: ["Real-time system monitoring", "Proactive alert management", "UK-based support team", "Rapid response times"]
  },
  {
    icon: Wrench,
    title: "Proactive Maintenance",
    description: "Regular maintenance and updates keep your systems running smoothly. We handle firmware updates, security patches, and performance optimisation.",
    features: ["Scheduled maintenance windows", "Firmware & security updates", "Performance optimisation", "Hardware health checks"]
  },
  {
    icon: Network,
    title: "Network Management",
    description: "Complete management of your network infrastructure including configuration, security policies, bandwidth management, and troubleshooting.",
    features: ["Configuration management", "Security policy enforcement", "Bandwidth optimisation", "Network troubleshooting"]
  },
  {
    icon: Settings,
    title: "Installation & Setup",
    description: "Professional installation and configuration of all systems. We ensure everything is set up correctly from day one for optimal performance.",
    features: ["Site surveys & planning", "Professional installation", "System configuration", "Testing & handover"]
  },
  {
    icon: GraduationCap,
    title: "Training & Onboarding",
    description: "Comprehensive training for your team to get the most out of your systems. From basic operation to advanced features, we ensure you're confident.",
    features: ["User training sessions", "Admin training", "Documentation & guides", "Ongoing support"]
  },
  {
    icon: Shield,
    title: "SLA Backed Support",
    description: "Service level agreements that guarantee response times and resolution targets. Peace of mind knowing your systems are covered.",
    features: ["Guaranteed response times", "Resolution targets", "Regular reporting", "Escalation procedures"]
  }
];

const existingInfraServices = [
  {
    icon: RefreshCw,
    title: "Takeover & Management",
    description: "Already have systems in place? We can take over management of your existing infrastructure, providing the same level of service as our installed solutions.",
    features: ["Infrastructure audit", "Smooth transition", "Ongoing management", "Performance optimisation"]
  },
  {
    icon: Headphones,
    title: "Support Contracts",
    description: "Flexible support contracts for your existing systems. Choose the level of support that suits your needs, from basic helpdesk to fully managed.",
    features: ["Tiered support levels", "Flexible contracts", "Remote & on-site support", "Spare parts management"]
  },
  {
    icon: FileSearch,
    title: "Audits & Assessments",
    description: "Comprehensive audits of your existing infrastructure to identify issues, security vulnerabilities, and opportunities for improvement.",
    features: ["Infrastructure assessment", "Security audit", "Performance analysis", "Recommendations report"]
  },
  {
    icon: TrendingUp,
    title: "Upgrades & Modernisation",
    description: "Gradual upgrades and modernisation of legacy systems. We help you plan and execute improvements without disrupting your operations.",
    features: ["Technology roadmap", "Phased upgrades", "Minimal disruption", "Future-proofing"]
  }
];

const processSteps = [
  {
    step: "01",
    title: "Assessment",
    description: "We audit your existing infrastructure, document systems, and identify any issues or improvements."
  },
  {
    step: "02",
    title: "Planning",
    description: "We create a detailed transition plan with timelines, responsibilities, and contingencies."
  },
  {
    step: "03",
    title: "Transition",
    description: "We execute the handover with minimal disruption, ensuring continuity of service throughout."
  },
  {
    step: "04",
    title: "Optimisation",
    description: "Once transitioned, we optimise performance and implement proactive monitoring."
  }
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
      <SEO 
        title="Managed Services | Umbrella Broadband"
        description="Value-added services including 24/7 monitoring, proactive maintenance, network management, and support for both new and existing infrastructure."
        keywords="managed IT services UK, 24/7 network monitoring, proactive maintenance, IT infrastructure support, property broadband services, SLA backed support"
        image="/images/services-hero-v8.webp"
      />
      
      {/* JSON-LD Structured Data for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Managed IT Services",
            "provider": {
              "@type": "Organization",
              "name": "Umbrella Broadband",
              "url": "https://umbrellabroadband.co.uk",
              "logo": "https://umbrellabroadband.co.uk/images/logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "46 Bath Street",
                "addressLocality": "Leamington Spa",
                "postalCode": "CV31 3AE",
                "addressCountry": "GB"
              },
              "telephone": "+44-1926-298866"
            },
            "areaServed": {
              "@type": "Country",
              "name": "United Kingdom"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Managed Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "24/7 Monitoring & Support",
                    "description": "Round-the-clock monitoring of your systems with proactive alerts and UK-based support."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Proactive Maintenance",
                    "description": "Regular maintenance and updates including firmware updates, security patches, and performance optimisation."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Network Management",
                    "description": "Complete management of network infrastructure including configuration, security policies, and troubleshooting."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Installation & Setup",
                    "description": "Professional installation and configuration of all systems for optimal performance."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Training & Onboarding",
                    "description": "Comprehensive training for your team from basic operation to advanced features."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SLA Backed Support",
                    "description": "Service level agreements with guaranteed response times and resolution targets."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Infrastructure Takeover & Management",
                    "description": "Take over management of existing infrastructure with smooth transition and ongoing support."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Audits & Assessments",
                    "description": "Comprehensive audits to identify issues, security vulnerabilities, and improvement opportunities."
                  }
                }
              ]
            }
          })
        }}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services-hero-v8.webp" 
            alt="Network connectivity and managed services" 
            className="w-full h-full object-cover opacity-70"
            width="1920"
            height="1080"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-6">
              Value-Added Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading">
              More Than Just Technology, <span className="text-secondary">Complete Peace of Mind</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Our value-added services ensure your connectivity solutions are always performing at their best. 
              From 24/7 monitoring to proactive maintenance, we've got you covered.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link href="/contact">
                <span className="btn btn-primary cursor-pointer text-sm md:text-base">Get Started</span>
              </Link>
              <a href="#existing" className="btn btn-outline-white cursor-pointer text-sm md:text-base">
                Have Existing Systems?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value-Added Services Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Our Value-Added Services
            </h2>
            <p className="text-lg text-gray-600">
              Every Umbrella solution comes with access to our comprehensive service portfolio. 
              Choose the level of support that matches your needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueAddedServices.map((service, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Infrastructure Section */}
      <section id="existing" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
              For Existing Infrastructure
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Already Have Systems in Place?
            </h2>
            <p className="text-lg text-gray-600">
              Whether you've inherited systems, are unhappy with your current provider, or simply want expert management 
              of your existing infrastructure, our services are available as standalone offerings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {existingInfraServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Our Takeover Process
            </h2>
            <p className="text-lg text-gray-600">
              We make transitioning to Umbrella Broadband as smooth as possible. 
              Here's how we handle infrastructure takeovers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
              Ready to Experience Better Support?
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Whether you need services for a new Umbrella solution or want us to manage your existing infrastructure, 
              we're here to help. Get in touch to discuss your requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link href="/contact">
                <span className="btn btn-primary cursor-pointer text-sm md:text-base">
                  Get in Touch
                </span>
              </Link>
              <Link href="/solutions">
                <span className="btn btn-outline-white cursor-pointer text-sm md:text-base">
                  View Our Solutions
                </span>
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
