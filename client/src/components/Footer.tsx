import { Link } from "wouter";
import { MapPin, Phone, Mail, Linkedin } from "lucide-react";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="block">
              <img 
                src="/images/logo-white.png" 
                alt="Logo" 
                width="125"
                height="88"
                className="h-[88px] w-auto mb-2 cursor-pointer -ml-3" 
              />
            </Link>
            <p className="text-gray-300 max-w-xs font-sans text-sm leading-relaxed mb-6">
              Leading provider of tailored Connectivity, Technology and Security Solutions for homes and businesses across the UK.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/company/umbrella-broadband-ltd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/umbrellabroadband" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors"
                aria-label="Follow us on X"
              >
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 font-sans">
              <li><Link href="/"><span className="hover:text-secondary cursor-pointer">Home</span></Link></li>
              <li><Link href="/about"><span className="hover:text-secondary cursor-pointer">About Us</span></Link></li>
              <li><Link href="/sectors"><span className="hover:text-secondary cursor-pointer">Sectors</span></Link></li>
              <li><Link href="/solutions"><span className="hover:text-secondary cursor-pointer">Solutions</span></Link></li>
              <li><Link href="/services"><span className="hover:text-secondary cursor-pointer">Services</span></Link></li>
              <li><Link href="/starlink"><span className="hover:text-secondary cursor-pointer">Managed Starlink</span></Link></li>
              <li><Link href="/blog"><span className="hover:text-secondary cursor-pointer">Blog</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-secondary cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Contact</h4>
            <ul className="space-y-3 text-gray-300 font-sans">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span>46 Bath Street, Leamington Spa, CV31 3AE</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                <a href="tel:01926298866" className="hover:text-secondary">01926 298866</a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                <a href="mailto:enquiries@umbrella-broadband.co.uk" className="hover:text-secondary">enquiries@umbrella-broadband.co.uk</a>
              </li>
            </ul>
            {/* Social Media Icons (Contact Column) */}
            <div className="flex items-center gap-3 mt-6">
              <a 
                href="https://www.linkedin.com/company/umbrella-broadband-ltd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/umbrellabroadband" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm font-sans">
          <p>© 2025 Umbrella Broadband. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
