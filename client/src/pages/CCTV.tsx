import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Camera, Shield, Eye, Cloud, Smartphone, Bell, CheckCircle2, ArrowRight, Video, HardDrive, Lock, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function CCTV() {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "HD & 4K Cameras",
      description: "Crystal-clear footage day and night with advanced low-light performance. IP cameras with wide dynamic range for challenging lighting conditions."
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Recording",
      description: "Secure cloud storage with redundant backups. Access your footage from anywhere without worrying about on-site storage failures."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Remote Viewing",
      description: "Watch live feeds and review recordings from your phone, tablet, or computer. Stay connected to your property 24/7."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "AI Analytics",
      description: "Smart detection for people, vehicles, and unusual activity. Reduce false alarms and focus on what matters."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Instant Alerts",
      description: "Real-time notifications when motion is detected or cameras go offline. Customisable alert zones and schedules."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "24/7 Monitoring",
      description: "Optional professional monitoring service with rapid response. Our team watches over your property around the clock."
    }
  ];

  const benefits = [
    "Deter crime and anti-social behaviour",
    "Evidence for insurance claims",
    "Monitor staff and visitor activity",
    "Protect assets and inventory",
    "Meet regulatory requirements",
    "Integrate with access control",
    "Scalable from 4 to 400+ cameras",
    "GDPR compliant solutions"
  ];

  const cameraTypes = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Dome Cameras",
      description: "Discreet, vandal-resistant design ideal for indoor and outdoor use. 360° coverage options available."
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Bullet Cameras",
      description: "Long-range visibility with powerful zoom. Perfect for car parks, perimeters, and large open areas."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "PTZ Cameras",
      description: "Pan, tilt, and zoom for active monitoring. Track subjects across wide areas with precision control."
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: "NVR Systems",
      description: "Network video recorders with RAID storage. Local recording with cloud backup for redundancy."
    }
  ];

  const sectors = [
    {
      title: "Student Accommodation",
      description: "Common area monitoring, entrance security, and package delivery verification."
    },
    {
      title: "Commercial Properties",
      description: "Perimeter protection, loading bay monitoring, and staff safety systems."
    },
    {
      title: "Retail & Hospitality",
      description: "Loss prevention, customer flow analysis, and incident documentation."
    },
    {
      title: "Construction Sites",
      description: "Temporary deployable systems with 4G connectivity for remote locations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="CCTV & Security Systems | Umbrella Broadband" 
        description="Professional CCTV installation and monitoring for businesses and landlords. HD cameras, cloud recording, remote viewing, and 24/7 monitoring. Protect your property with expert security solutions."
        keywords="CCTV installation UK, business security cameras, IP camera systems, cloud CCTV, remote monitoring, security camera installation, commercial CCTV, student accommodation security, property surveillance"
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center text-white overflow-hidden">
          {/* Background Image */}
          <picture className="absolute inset-0">
            <source media="(min-width: 768px)" srcSet="/images/solutions/cctv-hero-desktop.png" />
            <img loading="lazy" src="/images/solutions/cctv-hero-mobile.png" 
              alt="CCTV & Security Systems" 
              className="w-full h-full object-cover"
            />
          </picture>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/90 via-[#1a1a2e]/70 to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12 md:pt-20 md:pb-20 lg:pt-32 lg:pb-32 w-full">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Shield className="w-4 h-4" />
                Security Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-heading leading-tight drop-shadow-lg">
                CCTV &<br />
                <span className="text-red-400">Security</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
                Advanced surveillance systems with remote monitoring capabilities to protect 
                your premises and assets around the clock. Professional installation and ongoing support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-center">
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
                Complete Security Coverage
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From single-site installations to multi-location enterprise deployments, 
                our CCTV solutions are designed to meet your specific security requirements.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
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

        {/* Benefits & Camera Types Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6 font-heading">
                  Why Invest in CCTV?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Modern CCTV systems do more than just record footage. With intelligent analytics, 
                  remote access, and integration capabilities, they're a crucial part of any 
                  comprehensive security strategy.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-6 font-heading">Camera Options</h3>
                <div className="space-y-6">
                  {cameraTypes.map((camera, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                        {camera.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary mb-1">{camera.title}</h4>
                        <p className="text-gray-600 text-sm">{camera.description}</p>
                      </div>
                    </div>
                  ))}
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
                Security for Every Sector
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We design and install CCTV systems tailored to the unique security 
                challenges of your industry and property type.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectors.map((sector, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-red-300 hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold text-primary mb-2 font-heading">{sector.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{sector.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monitoring Options */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Monitoring Options
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the level of monitoring that suits your needs and budget.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <Lock className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2 font-heading">Self-Monitored</h3>
                <p className="text-gray-600 mb-4">Full access to live feeds and recordings via our app. You manage alerts and responses.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-500" /> Mobile app access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-500" /> Push notifications</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-500" /> Cloud storage included</li>
                </ul>
              </div>
              <div className="bg-primary p-8 rounded-xl border-2 border-red-400 text-white">
                <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 font-heading">Alarm Response</h3>
                <p className="text-gray-300 mb-4">Our team verifies alerts and contacts you or emergency services when needed.</p>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> 24/7 alarm verification</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> Police response liaison</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> Incident reporting</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <Eye className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2 font-heading">Proactive Monitoring</h3>
                <p className="text-gray-600 mb-4">Continuous live monitoring with immediate intervention for suspicious activity.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-500" /> Live operator watching</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-500" /> Audio challenge</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-500" /> Immediate escalation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6 font-heading">Protect What Matters Most</h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Get a free security assessment and quote. Our experts will design a CCTV 
                solution that meets your specific requirements and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn bg-red-500 hover:bg-red-600 text-white px-8 py-3 inline-flex items-center justify-center gap-2">
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
