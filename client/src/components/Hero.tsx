import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
        
        {/* Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
            Fully Managed <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Broadband, VoIP</span> <br />
            <span className="text-primary glow-text">& Security Solutions</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed border-l-2 border-primary/30 pl-6">
            Fast, reliable, and secure connectivity with full network management for landlords, businesses, and developers.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 h-14 rounded-md shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300 hover:-translate-y-1">
              Our Solutions
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white font-semibold text-lg px-8 h-14 rounded-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              Get in Touch
            </Button>
          </div>
        </div>

        {/* Isometric Illustration */}
        <div className="relative animate-in slide-in-from-right-10 duration-1000 fade-in delay-200 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[600px] aspect-square">
            {/* Main Image */}
            <img 
              src="/images/hero-illustration-dark.png" 
              alt="Isometric Data Center and Cloud Infrastructure" 
              className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,240,255,0.15)]"
            />
            
            {/* Floating Elements (Decorative) */}
            <div className="absolute top-10 right-10 w-20 h-20 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute bottom-20 left-10 w-4 h-4 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>
  );
}
