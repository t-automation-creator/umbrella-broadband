import { useEffect, useRef } from "react";

export default function Partners() {
  const partners = [
    { src: "/images/partners/belvoir_240x120.png", alt: "Belvoir" },
    { src: "/images/partners/blaze_240x120.png", alt: "Blaze" },
    { src: "/images/partners/City_Fibre_240x120.png", alt: "CityFibre" },
    { src: "/images/partners/EE_240x120.png", alt: "EE" },
    { src: "/images/partners/Glide_240x120.png", alt: "Glide" },
    { src: "/images/partners/handles_240x120.png", alt: "Handles" },
    { src: "/images/partners/mackenzie_millier_240x120.png", alt: "Mackenzie Millier" },
    { src: "/images/partners/Music-Matters_240x120.png", alt: "Music Matters" },
    { src: "/images/partners/Neos_240x120.png", alt: "Neos" },
    { src: "/images/partners/Norbain_240x120.png", alt: "Norbain" },
    { src: "/images/partners/o2_240x120.png", alt: "O2" },
    { src: "/images/partners/openareach_240x120.png", alt: "Openreach" },
    { src: "/images/partners/talktalk_240x120.png", alt: "TalkTalk" },
    { src: "/images/partners/taraandco_240x120.png", alt: "Tara & Co" },
    { src: "/images/partners/ultra_240x120.png", alt: "Ultra" },
    { src: "/images/partners/Virgin1_240x120.png", alt: "Virgin Media" },
    { src: "/images/partners/Vodafone_240x120.png", alt: "Vodafone" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Get the width of one set of logos
      const singleSetWidth = scrollContainer.scrollWidth / 2;
      
      // Reset position when we've scrolled through one complete set
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Duplicate the partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-blue-200 mb-10 font-semibold tracking-wider font-heading">
          TRUSTED BY INDUSTRY LEADERS
        </p>
        <div className="relative overflow-hidden">
          {/* Gradient fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div 
            ref={scrollRef}
            className="flex items-center gap-12 will-change-transform"
            style={{ width: "fit-content" }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div 
                key={index}
                className="flex-shrink-0 h-12 w-32 flex items-center justify-center"
              >
                <img loading="lazy" src={partner.src} 
                  alt={partner.alt}
                  className="h-10 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
