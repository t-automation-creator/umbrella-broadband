import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

import { useEffect, useRef } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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

  return (
    <nav ref={navRef} className="bg-primary shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* navbar-inner: flex row, align-center, justify-between, height 72px */}
        <div className="flex justify-between items-center h-[88px]">
          
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center h-full">
            <Link href="/">
              {/* Logo: block, height 44px, width auto */}
              <img 
                src="https://umbrella.onyx-sites.io/wp-content/uploads/2023/07/UB_White-Large.png" 
                alt="Umbrella Broadband" 
                className="block h-[44px] w-auto cursor-pointer mr-12" 
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
              <Link href="/solutions" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Solutions
              </Link>
              <Link href="/case-studies" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Case Studies
              </Link>
              <Link href="/blog" className="flex items-center h-full px-[18px] hover:text-secondary transition-colors cursor-pointer font-medium leading-none">
                Blog
              </Link>
            </div>
          </div>
          
          {/* Right Side: Contact Button */}
          <div className="hidden md:flex items-center h-full">
            <Link href="/contact">
              <span className="btn btn-primary cursor-pointer">Contact</span>
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
            <Link href="/case-studies">
              <span className="block text-white hover:text-secondary cursor-pointer py-2">Case Studies</span>
            </Link>
            <Link href="/blog">
              <span className="block text-white hover:text-secondary cursor-pointer py-2">Blog</span>
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
