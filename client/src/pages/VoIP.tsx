import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Phone, Cloud, Smartphone, Users, Headphones, BarChart3, CheckCircle2, ArrowRight, PhoneCall, PhoneForwarded, Voicemail, Video } from "lucide-react";
import { Link } from "wouter";

export default function VoIP() {
  const features = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud-Based System",
      description: "No expensive on-site hardware required. Your phone system lives in the cloud, accessible from anywhere with an internet connection."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Work From Anywhere",
      description: "Take your business number with you. Make and receive calls on your mobile, laptop, or desk phone - wherever you are."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Unified Communications",
      description: "Voice, video, messaging, and presence all in one platform. Seamless collaboration for modern teams."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Call Analytics",
      description: "Detailed insights into call volumes, wait times, and agent performance. Make data-driven decisions."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Contact Centre Features",
      description: "IVR menus, call queues, ring groups, and call recording. Enterprise features at SME prices."
    },
    {
      icon: <PhoneForwarded className="w-8 h-8" />,
      title: "Smart Call Routing",
      description: "Route calls based on time, location, or availability. Never miss an important call again."
    }
  ];

  const benefits = [
    "Reduce phone bills by up to 50%",
    "Keep your existing numbers",
    "Unlimited UK landline calls",
    "Free internal calls between sites",
    "No long-term contracts required",
    "Scales instantly as you grow",
    "Disaster recovery built-in",
    "Integration with CRM systems"
  ];

  const callFeatures = [
    {
      icon: <PhoneCall className="w-6 h-6" />,
      title: "Auto Attendant",
      description: "Professional IVR menus that route callers to the right department automatically."
    },
    {
      icon: <Voicemail className="w-6 h-6" />,
      title: "Voicemail to Email",
      description: "Receive voicemail messages as audio files directly in your inbox."
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Conferencing",
      description: "HD video meetings with screen sharing, recording, and virtual backgrounds."
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Recording",
      description: "Record calls for training, compliance, or quality assurance purposes."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="VoIP Phone Systems | Umbrella Broadband" 
        description="Cloud-based VoIP phone systems for businesses. Reduce costs, work from anywhere, and get enterprise features at SME prices. Hosted telephony with UK support."
        keywords="VoIP phone systems UK, cloud phone system, business telephony, hosted PBX, SIP trunking, business VoIP"
        image="/images/solutions/voip-hero-desktop.jpg"
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center text-white overflow-hidden">
          {/* Background Image */}
          <picture className="absolute inset-0">
            <source media="(min-width: 768px)" srcSet="/images/solutions/voip-hero-desktop.jpg" />
            <img loading="lazy" src="/images/solutions/voip-hero-mobile.jpg" 
              alt="VoIP Phone Systems" 
              className="w-full h-full object-cover"
            />
          </picture>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/90 via-[#1a365d]/70 to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12 md:pt-20 md:pb-20 lg:pt-32 lg:pb-32 w-full">
            <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Phone className="w-4 h-4" />
                Business Telephony
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-heading leading-tight drop-shadow-lg">
                VoIP Phone<br />
                <span className="text-green-400">Systems</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
                Cost-effective, feature-rich cloud phone systems that keep your business 
                connected anywhere, on any device. Enterprise features at SME prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/contact" className="btn bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-center">
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
                Modern Business Communications
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Replace your outdated phone system with a flexible, feature-rich cloud solution 
                that grows with your business and works wherever you do.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
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
                  Why Switch to VoIP?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Traditional phone lines are expensive and inflexible. VoIP delivers the same 
                  crystal-clear call quality over your internet connection, with a wealth of 
                  features that traditional systems simply can't match.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-6 font-heading">Key Features</h3>
                <div className="space-y-6">
                  {callFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
                Flexible Plans for Every Business
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From small teams to large enterprises, we have a VoIP solution that fits your needs and budget.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-2 font-heading">Essentials</h3>
                <p className="text-gray-600 mb-4">For small teams getting started</p>
                <div className="text-3xl font-bold text-primary mb-6">From £8<span className="text-lg font-normal text-gray-500">/user/month</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited UK calls</li>
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Mobile & desktop apps</li>
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Voicemail to email</li>
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Basic call routing</li>
                </ul>
                <Link href="/contact" className="btn bg-primary hover:bg-primary/90 text-white w-full py-3 text-center block">
                  Get Started
                </Link>
              </div>
              <div className="bg-primary p-8 rounded-xl border-2 border-green-400 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm px-4 py-1 rounded-full">Most Popular</div>
                <h3 className="text-xl font-bold text-white mb-2 font-heading">Professional</h3>
                <p className="text-gray-300 mb-4">For growing businesses</p>
                <div className="text-3xl font-bold text-white mb-6">From £15<span className="text-lg font-normal text-gray-300">/user/month</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-green-400" /> Everything in Essentials</li>
                  <li className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-green-400" /> Video conferencing</li>
                  <li className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-green-400" /> Call recording</li>
                  <li className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-green-400" /> CRM integration</li>
                  <li className="flex items-center gap-2 text-gray-200"><CheckCircle2 className="w-4 h-4 text-green-400" /> Advanced analytics</li>
                </ul>
                <Link href="/contact" className="btn bg-green-500 hover:bg-green-600 text-white w-full py-3 text-center block">
                  Get Started
                </Link>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-2 font-heading">Enterprise</h3>
                <p className="text-gray-600 mb-4">For large organisations</p>
                <div className="text-3xl font-bold text-primary mb-6">Custom<span className="text-lg font-normal text-gray-500"> pricing</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Everything in Professional</li>
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Contact centre features</li>
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Dedicated account manager</li>
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom integrations</li>
                  <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> SLA guarantees</li>
                </ul>
                <Link href="/contact" className="btn bg-primary hover:bg-primary/90 text-white w-full py-3 text-center block">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6 font-heading">Ready to Upgrade Your Phone System?</h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Get a free consultation and see how much you could save by switching to VoIP. 
                We'll handle the migration with zero downtime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn bg-green-500 hover:bg-green-600 text-white px-8 py-3 inline-flex items-center justify-center gap-2">
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
