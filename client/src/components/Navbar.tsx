import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, ChevronDown, Linkedin } from "lucide-react";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

import { useEffect, useRef } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav ref={navRef} className="bg-primary shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* navbar-inner: flex row, align-center, justify-between, height 72px */}
        <div className="flex justify-between items-center h-[88px]">
          
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center h-full">
            <Link href="/">
              {/* Logo: block, height 88px, width auto */}
              <img 
                src="/images/logo-white.png" 
                alt="Umbrella Broadband" 
                width="125"
                height="88"
                className="block h-[88px] w-auto cursor-pointer mr-12" 
              />
            </Link>
            
            {/* Desktop Navigation Links: flex, align-center, height 100%, no margin/padding issues */}
            <div className="hidden md:flex items-center h-full text-white">
              <Link href="/" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Home
              </Link>
              <Link href="/about" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                About Us
              </Link>
              <Link href="/sectors" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Sectors
              </Link>
              
              {/* Solutions Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative h-full"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <div className="flex items-center h-full">
                  <Link href="/solutions" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                    Solutions
                  </Link>
                  <button 
                    className="flex items-center h-full pr-[18px] -ml-3 hover:text-secondary transition-colors cursor-pointer"
                    onClick={() => setSolutionsOpen(!solutionsOpen)}
                    aria-label="Toggle solutions menu"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {/* Dropdown Menu */}
                {solutionsOpen && (
                  <div className="absolute top-full left-0 bg-white rounded-lg shadow-lg py-2 min-w-[220px] border border-gray-100">
                    <Link href="/managed-broadband">
                      <span className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer font-medium">
                        Managed Broadband
                      </span>
                    </Link>
                    <Link href="/voip">
                      <span className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer font-medium">
                        VoIP Phone Systems
                      </span>
                    </Link>
                    <Link href="/cctv">
                      <span className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer font-medium">
                        CCTV & Security
                      </span>
                    </Link>
                    <Link href="/access-control">
                      <span className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer font-medium">
                        Access Control Solutions
                      </span>
                    </Link>
                    <Link href="/starlink">
                      <span className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer font-medium">
                        Managed Starlink
                      </span>
                    </Link>
                  </div>
                )}
              </div>
              
              <Link href="/services" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Services
              </Link>
              <Link href="/case-studies" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Case Studies
              </Link>
              <Link href="/blog" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Blog
              </Link>
            </div>
          </div>
          
          {/* Right Side: Contact Button + Social Icons */}
          <div className="hidden md:flex items-center h-full gap-4">
            <Link href="/contact">
              <span className="btn btn-primary cursor-pointer">Contact</span>
            </Link>
            <div className="flex items-center gap-2">
              <a 
                href="https://www.linkedin.com/company/umbrella-broadband-ltd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors text-white"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/umbrellabroadband" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors text-white"
                aria-label="Follow us on X"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </div>
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
          <div className="px-4 py-4">
            <Link href="/">
              <span className="block text-white hover:text-secondary cursor-pointer py-3">Home</span>
            </Link>
            <Link href="/about">
              <span className="block text-white hover:text-secondary cursor-pointer py-3">About Us</span>
            </Link>
            <Link href="/sectors">
              <span className="block text-white hover:text-secondary cursor-pointer py-3">Sectors</span>
            </Link>
            
            {/* Mobile Solutions Dropdown */}
            <div>
              <div className="flex items-center justify-between w-full py-3">
                <Link href="/solutions">
                  <span className="text-white hover:text-secondary cursor-pointer">Solutions</span>
                </Link>
                <button 
                  onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  className="text-white hover:text-secondary cursor-pointer p-1"
                  aria-label="Toggle solutions menu"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileSolutionsOpen && (
                <div className="pl-4">
                  <Link href="/managed-broadband">
                    <span className="block text-gray-300 hover:text-secondary cursor-pointer py-3">Managed Broadband</span>
                  </Link>
                  <Link href="/voip">
                    <span className="block text-gray-300 hover:text-secondary cursor-pointer py-3">VoIP Phone Systems</span>
                  </Link>
                  <Link href="/cctv">
                    <span className="block text-gray-300 hover:text-secondary cursor-pointer py-3">CCTV & Security</span>
                  </Link>
                  <Link href="/access-control">
                    <span className="block text-gray-300 hover:text-secondary cursor-pointer py-3">Access Control Solutions</span>
                  </Link>
                  <Link href="/starlink">
                    <span className="block text-gray-300 hover:text-secondary cursor-pointer py-3">Managed Starlink</span>
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/services">
              <span className="block text-white hover:text-secondary cursor-pointer py-3">Services</span>
            </Link>
            <Link href="/case-studies">
              <span className="block text-white hover:text-secondary cursor-pointer py-3">Case Studies</span>
            </Link>
            <Link href="/blog">
              <span className="block text-white hover:text-secondary cursor-pointer py-3">Blog</span>
            </Link>
            <Link href="/contact">
              <span className="block text-white hover:text-secondary cursor-pointer py-3">Contact</span>
            </Link>
            
            {/* Mobile Social Icons */}
            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-700">
              <a 
                href="https://www.linkedin.com/company/umbrella-broadband-ltd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors text-white"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/umbrellabroadband" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors text-white"
                aria-label="Follow us on X"
              >
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
