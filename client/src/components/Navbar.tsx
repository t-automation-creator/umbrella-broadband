import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/">
              <img 
                src="https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_White-Large.png" 
                alt="Umbrella Broadband" 
                className="h-12 w-auto cursor-pointer" 
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-white">
            <Link href="/">
              <span className="hover:text-secondary transition-colors cursor-pointer font-medium">Home</span>
            </Link>
            <Link href="/about">
              <span className="hover:text-secondary transition-colors cursor-pointer font-medium">About Us</span>
            </Link>
            <Link href="/sectors">
              <span className="hover:text-secondary transition-colors cursor-pointer font-medium">Sectors</span>
            </Link>
            <Link href="/solutions">
              <span className="hover:text-secondary transition-colors cursor-pointer font-medium">Solutions</span>
            </Link>
            <Link href="/contact">
              <span className="btn btn-primary ml-4 cursor-pointer">Contact</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-gray-700">
          <div className="px-4 py-4 space-y-3">
            <Link href="/">
              <span className="block text-white hover:text-secondary cursor-pointer py-2">Home</span>
            </Link>
            <Link href="/about">
              <span className="block text-white hover:text-secondary cursor-pointer py-2">About Us</span>
            </Link>
            <Link href="/sectors">
              <span className="block text-white hover:text-secondary cursor-pointer py-2">Sectors</span>
            </Link>
            <Link href="/solutions">
              <span className="block text-white hover:text-secondary cursor-pointer py-2">Solutions</span>
            </Link>
            <Link href="/contact">
              <span className="block text-white hover:text-secondary cursor-pointer py-2">Contact</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
