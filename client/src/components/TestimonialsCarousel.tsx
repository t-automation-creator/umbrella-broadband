import { useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  sector: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Umbrella Broadband transformed our student accommodation. We went from constant complaints about WiFi to zero issues. Their 24/7 support means we never have to worry about connectivity problems during exam season.",
    author: "Sarah Mitchell",
    role: "Operations Director",
    company: "StudentStay Properties",
    rating: 5,
    sector: "Student Accommodation"
  },
  {
    id: 2,
    quote: "As a landlord with 15 HMO properties, managing internet was a nightmare. Umbrella took over everything - installation, support, billing. My tenants are happy and I've saved countless hours.",
    author: "James Richardson",
    role: "Property Portfolio Owner",
    company: "Richardson Lettings",
    rating: 5,
    sector: "HMO Landlord"
  },
  {
    id: 3,
    quote: "The VoIP system they installed has revolutionised how we communicate. Crystal clear calls, seamless integration with our CRM, and we've cut our phone bills by 40%. Highly recommend.",
    author: "Emma Thompson",
    role: "Managing Director",
    company: "Midlands Legal Services",
    rating: 5,
    sector: "Professional Services"
  },
  {
    id: 4,
    quote: "When our main broadband went down, Umbrella had a Starlink backup running within hours. That level of responsiveness saved us from losing a critical project deadline. Exceptional service.",
    author: "David Chen",
    role: "Site Manager",
    company: "BuildRight Construction",
    rating: 5,
    sector: "Construction"
  },
  {
    id: 5,
    quote: "The CCTV and access control system they designed for our development is exactly what we needed. Remote monitoring, cloud storage, and their support team is always available. First-class.",
    author: "Lisa Patel",
    role: "Development Manager",
    company: "Horizon Developments",
    rating: 5,
    sector: "Property Development"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-[#0a3d6e] to-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-heading">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what businesses and landlords across the UK have to say about working with us.
          </p>
        </div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Quote Icon */}
          <div className="absolute -top-4 left-0 lg:left-8 opacity-20">
            <Quote className="w-24 h-24 text-secondary" />
          </div>

          {/* Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/20 relative">
            {/* Rating Stars */}
            <div className="flex gap-1 mb-6 justify-center lg:justify-start">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg lg:text-xl text-gray-100 leading-relaxed mb-8 text-center lg:text-left">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author Info */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-center lg:text-left">
                <div className="font-bold text-white text-lg">{currentTestimonial.author}</div>
                <div className="text-gray-300">{currentTestimonial.role}</div>
                <div className="text-secondary font-medium">{currentTestimonial.company}</div>
              </div>
              <div className="text-center lg:text-right">
                <span className="inline-block bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium">
                  {currentTestimonial.sector}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-secondary w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
