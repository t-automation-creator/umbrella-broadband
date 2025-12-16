import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

export default function Sectors() {
  const sectors = [
    {
      title: "Landlords & HMOs",
      description: "Reliable, high-speed internet is a top priority for tenants. We provide fully managed broadband solutions that eliminate connectivity headaches for landlords, ensuring happy tenants and higher retention rates.",
      image: "https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_Landlords_Hero.png",
      features: ["Zero downtime guarantee", "24/7 tenant support", "Seamless installation"]
    },
    {
      title: "Property Developers",
      description: "Future-proof your developments with our pre-installed network infrastructure. We work with developers from the planning stage to ensure every unit is connectivity-ready from day one.",
      image: "https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_Developers_Hero.png",
      features: ["Infrastructure planning", "Smart building integration", "Value-added connectivity"]
    },
    {
      title: "SME Businesses",
      description: "Business continuity relies on robust connectivity. Our enterprise-grade broadband and VoIP solutions are designed to keep your business running smoothly, with dedicated support when you need it.",
      image: "https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_Business_Hero.png",
      features: ["Dedicated leased lines", "VoIP telephony systems", "Cyber security packages"]
    },
    {
      title: "Purpose Built Student Accommodation (PBSA)",
      description: "Students demand fast, reliable internet for study and entertainment. Our managed service ensures high-density coverage and secure access for hundreds of users simultaneously.",
      image: "https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_Student_Hero.png",
      features: ["High-density Wi-Fi", "Secure personal networks", "Content filtering options"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">Sectors We Serve</h1>
            <p className="text-lg text-gray-200">
              Tailored connectivity solutions for every industry. We understand the unique challenges of your sector and provide bespoke infrastructure to match.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">
          {sectors.map((sector, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <img 
                  src={sector.image} 
                  alt={sector.title} 
                  className="rounded-2xl shadow-xl w-full object-cover h-80 lg:h-auto" 
                />
              </div>
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <h2 className="text-3xl font-bold text-primary mb-6 font-heading">{sector.title}</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  {sector.description}
                </p>
                <ul className="space-y-4">
                  {sector.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-secondary mr-3" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
