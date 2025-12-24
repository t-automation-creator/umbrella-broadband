import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "umbrella_cookie_consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                We Value Your Privacy
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                We use cookies to enhance your browsing experience, serve personalised content, and analyse our traffic. 
                By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or decline 
                non-essential cookies by clicking "Decline".
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAccept}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Decline
                </Button>
                <a 
                  href="/privacy-policy" 
                  className="inline-flex items-center text-sm text-primary hover:underline self-center"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
