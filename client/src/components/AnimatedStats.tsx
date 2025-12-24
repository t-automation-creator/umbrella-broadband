import { useState, useEffect, useRef } from "react";
import { Building2, Clock, Headphones, Wifi } from "lucide-react";

interface Stat {
  id: number;
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  {
    id: 1,
    value: 1500,
    suffix: "+",
    label: "Properties Connected",
    description: "Student halls, HMOs, and commercial buildings across the UK",
    icon: <Building2 className="w-8 h-8" />
  },
  {
    id: 2,
    value: 99.9,
    suffix: "%",
    label: "Network Uptime",
    description: "Enterprise-grade reliability with redundant connections",
    icon: <Wifi className="w-8 h-8" />
  },
  {
    id: 3,
    value: 15,
    suffix: " min",
    label: "Avg. Response Time",
    description: "UK-based support team available around the clock",
    icon: <Headphones className="w-8 h-8" />
  },
  {
    id: 4,
    value: 10,
    suffix: "+ years",
    label: "Industry Experience",
    description: "Trusted by landlords and businesses since 2010",
    icon: <Clock className="w-8 h-8" />
  }
];

function AnimatedCounter({ 
  target, 
  suffix, 
  isVisible,
  duration = 2000 
}: { 
  target: number; 
  suffix: string; 
  isVisible: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    
    hasAnimated.current = true;
    const startTime = Date.now();
    const isDecimal = target % 1 !== 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = target * easeOutQuart;
      
      setCount(isDecimal ? parseFloat(currentValue.toFixed(1)) : Math.floor(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function AnimatedStats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
            Trusted Across the UK
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Numbers that speak for themselves. We're proud of the reliable service we deliver to landlords and businesses every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-secondary mx-auto mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 font-heading">
                <AnimatedCounter 
                  target={stat.value} 
                  suffix={stat.suffix} 
                  isVisible={isVisible}
                />
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-2">
                {stat.label}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
