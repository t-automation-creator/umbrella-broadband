import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <img 
                src="https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_White-Large.png" 
                alt="Logo" 
                className="h-12 w-auto mb-6 cursor-pointer" 
              />
            </Link>
            <p className="text-gray-300 max-w-sm mb-6 font-sans">
              Leading provider of tailored Connectivity, Technology and Security Solutions for homes and businesses across the UK.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 font-sans">
              <li><Link href="/"><span className="hover:text-secondary cursor-pointer">Home</span></Link></li>
              <li><Link href="/about"><span className="hover:text-secondary cursor-pointer">About Us</span></Link></li>
              <li><Link href="/sectors"><span className="hover:text-secondary cursor-pointer">Sectors</span></Link></li>
              <li><Link href="/solutions"><span className="hover:text-secondary cursor-pointer">Solutions</span></Link></li>
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
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm font-sans">
          <p>© 2025 Umbrella Broadband. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
