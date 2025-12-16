import { Shield, Wifi, Phone, Server, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "Ultra-Fast Broadband",
    description: "Gigabit-capable fiber connectivity ensuring zero downtime for your business operations."
  },
  {
    icon: Phone,
    title: "VoIP Telephony",
    description: "Crystal clear voice solutions integrated with modern cloud communication platforms."
  },
  {
    icon: Shield,
    title: "Cyber Security",
    description: "Enterprise-grade firewalls and threat detection to keep your data fortress secure."
  },
  {
    icon: Server,
    title: "Managed Networks",
    description: "End-to-end infrastructure management, monitoring, and maintenance 24/7."
  },
  {
    icon: Lock,
    title: "Access Control",
    description: "Smart building entry systems integrated directly with your network infrastructure."
  },
  {
    icon: Globe,
    title: "IoT Solutions",
    description: "Smart connectivity for modern buildings, enabling automation and efficiency."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Comprehensive <span className="text-primary">Digital Infrastructure</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We provide the backbone for modern businesses and residential developments with our integrated suite of services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-8 rounded-xl bg-card/50 border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Hover Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/5 to-transparent -mr-8 -mt-8 rounded-full blur-xl group-hover:from-primary/20 transition-all"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
