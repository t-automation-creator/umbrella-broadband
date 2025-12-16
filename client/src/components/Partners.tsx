export default function Partners() {
  const partners = [
    "https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/Neos_240x120.png",
    "https://umbrella.onyx-sites.io/wp-content/uploads/2023/08/o2_240x120.png",
    "https://umbrella.onyx-sites.io/wp-content/uploads/2023/08/EE_240x120.png",
    "https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/Vodafone_240x120.png",
    "https://umbrella.onyx-sites.io/wp-content/uploads/2023/08/Virgin1_240x120.png",
    "https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/City_Fibre_240x120.png"
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-blue-200 mb-10 font-semibold tracking-wider font-heading">
          TRUSTED BY INDUSTRY LEADERS
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-80">
          {partners.map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt="Partner" 
              className="h-10 object-contain mx-auto brightness-0 invert" 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
