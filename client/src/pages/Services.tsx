import { Link } from "wouter";
import SEO from "@/components/SEO";
import { 
  Wifi, 
  Phone, 
  Camera, 
  KeyRound, 
  Satellite, 
  Settings, 
  ArrowRight,
  CheckCircle2,
  Wrench,
  RefreshCw,
  Shield,
  HeadphonesIcon,
  Clock,
  Users
} from "lucide-react";

const managedSolutions = [
  {
    icon: Wifi,
    title: "Managed Broadband",
    description: "Complete broadband solutions with 24/7 monitoring, proactive maintenance, and UK-based support. Perfect for HMOs, student accommodation, and commercial properties.",
    link: "/managed-broadband",
    features: ["Network design & installation", "24/7 monitoring", "Proactive maintenance", "UK-based support"]
  },
  {
    icon: Phone,
    title: "VoIP Phone Systems",
    description: "Cloud-based phone systems fully managed by our team. From setup to ongoing support, we handle everything so you can focus on your business.",
    link: "/voip",
    features: ["System configuration", "User management", "Call analytics", "Hardware support"]
  },
  {
    icon: Camera,
    title: "CCTV & Security",
    description: "Professional CCTV installation and monitoring services. We design, install, and manage your security infrastructure for complete peace of mind.",
    link: "/cctv",
    features: ["System design", "Professional installation", "Remote monitoring", "Maintenance & repairs"]
  },
  {
    icon: KeyRound,
    title: "Access Control",
    description: "Managed access control solutions including intercoms, keyless entry, and biometric systems. Full lifecycle management from installation to support.",
    link: "/access-control",
    features: ["Access management", "User provisioning", "System integration", "24/7 support"]
  },
  {
    icon: Satellite,
    title: "Managed Starlink",
    description: "Professional Starlink deployment and management for locations where traditional broadband isn't viable. We handle the complexity, you enjoy the connectivity.",
    link: "/starlink",
    features: ["Site assessment", "Professional installation", "Network integration", "Ongoing management"]
  }
];

const takeoverServices = [
  {
    icon: RefreshCw,
    title: "Network Takeover",
    description: "Already have broadband infrastructure in place? We can take over management of your existing network, optimise performance, and provide ongoing support.",
    benefits: ["Audit of existing infrastructure", "Performance optimisation", "Seamless transition", "Improved reliability"]
  },
  {
    icon: Wrench,
    title: "Legacy System Management",
    description: "Struggling with outdated or poorly maintained systems? Our team can step in to manage, maintain, and gradually modernise your existing technology.",
    benefits: ["System assessment", "Documentation & mapping", "Maintenance scheduling", "Upgrade planning"]
  },
  {
    icon: Shield,
    title: "Security System Takeover",
    description: "Inherited CCTV or access control systems? We can take over management, ensure they're properly configured, and provide ongoing monitoring and maintenance.",
    benefits: ["Security audit", "Configuration review", "Monitoring setup", "Maintenance contracts"]
  },
  {
    icon: HeadphonesIcon,
    title: "Support Contract Takeover",
    description: "Unhappy with your current provider? We offer smooth transitions with minimal disruption, taking over support responsibilities for your existing systems.",
    benefits: ["Knowledge transfer", "Documentation handover", "Staff training", "SLA guarantees"]
  }
];

const whyManaged = [
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Round-the-clock monitoring means issues are often resolved before you even notice them."
  },
  {
    icon: Users,
    title: "UK-Based Support",
    description: "Real people, based in the UK, who understand your business and can respond quickly."
  },
  {
    icon: Shield,
    title: "Proactive Maintenance",
    description: "Regular maintenance and updates keep your systems running smoothly and securely."
  },
  {
    icon: Settings,
    title: "Single Point of Contact",
    description: "One provider for all your connectivity needs means simpler management and accountability."
  }
];

export default function Services() {
  return (
    <>
      <SEO 
        title="Managed Services | Umbrella Broadband"
        description="Fully managed connectivity services and takeover of existing infrastructure. From broadband to CCTV, we handle the technology so you can focus on your business."
        image="/images/services-hero.webp"
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services-hero.webp" 
            alt="Network connectivity and managed services" 
            className="w-full h-full object-cover opacity-40"
            width="1920"
            height="1080"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-6">
              Managed Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading">
              We Manage the Technology,<br />
              <span className="text-secondary">You Focus on Business</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Whether you need a complete managed solution or want us to take over your existing infrastructure, 
              Umbrella Broadband provides the expertise and support to keep your connectivity running smoothly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <span className="btn btn-secondary cursor-pointer">Get Started</span>
              </Link>
              <a href="#takeover" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary cursor-pointer">
                Existing Infrastructure?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Managed Solutions Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Complete Solutions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Fully Managed Solutions
            </h2>
            <p className="text-lg text-gray-600">
              End-to-end managed services where we handle everything from design and installation 
              to ongoing monitoring and support. One provider, complete peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {managedSolutions.map((solution, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <solution.icon className="w-7 h-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={solution.link}>
                  <span className="inline-flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors cursor-pointer">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Managed Services */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Why Choose Managed Services?
            </h2>
            <p className="text-lg text-gray-600">
              Stop worrying about your connectivity infrastructure. Let our experts handle it while you focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyManaged.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Takeover Services Section */}
      <section id="takeover" className="py-20 bg-white scroll-mt-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-4">
              Infrastructure Takeover
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Already Have Infrastructure?
            </h2>
            <p className="text-lg text-gray-600">
              Whether you've inherited systems, are unhappy with your current provider, or simply want expert management 
              of your existing infrastructure, we can help. Our takeover services ensure a smooth transition with minimal disruption.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {takeoverServices.map((service, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {service.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Our Takeover Process
            </h2>
            <p className="text-lg text-gray-200">
              We make transitioning to Umbrella Broadband as smooth as possible. Here's how we handle infrastructure takeovers.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Assessment", description: "We audit your existing infrastructure, document systems, and identify any issues or improvements." },
              { step: "02", title: "Planning", description: "We create a detailed transition plan with timelines, responsibilities, and contingencies." },
              { step: "03", title: "Transition", description: "We execute the handover with minimal disruption, ensuring continuity of service throughout." },
              { step: "04", title: "Optimisation", description: "Once transitioned, we optimise performance and implement proactive monitoring." }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-white/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2 font-heading">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 w-8 h-0.5 bg-secondary/50 translate-x-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Ready to Simplify Your Connectivity?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you need a complete managed solution or want us to take over your existing infrastructure, 
              we're here to help. Get in touch to discuss your requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <span className="btn btn-primary cursor-pointer">Contact Us</span>
              </Link>
              <Link href="/case-studies">
                <span className="btn btn-outline cursor-pointer">View Case Studies</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
