import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="w-full py-6 absolute top-0 z-50">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-pulse"></div>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-10 h-10 text-primary relative z-10"
              >
                <path d="M12 2a10 10 0 0 1 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5a4 4 0 0 1 7 0" />
                <path d="M12 12v10" />
                <path d="M8 17h8" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl leading-none tracking-wider text-white">UMBRELLA</span>
              <span className="font-sans text-xs tracking-[0.2em] text-primary-foreground/70">BROADBAND</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/">
            <span className="text-sm font-medium text-white/90 hover:text-primary transition-colors cursor-pointer">Home</span>
          </Link>
          <Link href="/about">
            <span className="text-sm font-medium text-white/90 hover:text-primary transition-colors cursor-pointer">About Us</span>
          </Link>
          <Link href="/sectors">
            <span className="text-sm font-medium text-white/90 hover:text-primary transition-colors cursor-pointer">Sectors</span>
          </Link>
          <Link href="/solutions">
            <span className="text-sm font-medium text-white/90 hover:text-primary transition-colors cursor-pointer">Solutions</span>
          </Link>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-md shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all duration-300">
            Contact
          </Button>
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
}
