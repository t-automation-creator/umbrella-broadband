import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#050C1F] border-t border-white/10 pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8 text-primary"
                >
                  <path d="M12 2a10 10 0 0 1 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5a4 4 0 0 1 7 0" />
                  <path d="M12 12v10" />
                  <path d="M8 17h8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-none tracking-wider text-white">UMBRELLA</span>
                <span className="font-sans text-[10px] tracking-[0.2em] text-primary-foreground/70">BROADBAND</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Empowering businesses and communities with next-generation connectivity and security solutions.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">News & Insights</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="/broadband" className="text-muted-foreground hover:text-primary transition-colors">Business Broadband</Link></li>
              <li><Link href="/voip" className="text-muted-foreground hover:text-primary transition-colors">VoIP Systems</Link></li>
              <li><Link href="/security" className="text-muted-foreground hover:text-primary transition-colors">Network Security</Link></li>
              <li><Link href="/iot" className="text-muted-foreground hover:text-primary transition-colors">IoT Integration</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Umbrella Broadband. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
