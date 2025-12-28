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
      const timer = setTimeout(() => setIsVisible(true), 2000);
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
    <div className="fixed bottom-4 left-4 z-40 max-w-sm animate-in slide-in-from-left duration-500">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 leading-relaxed">
              We use cookies to enhance your experience.{" "}
              <a 
                href="/privacy-policy" 
                className="text-primary hover:underline"
              >
                Learn more
              </a>
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleAccept}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white text-xs px-3 h-8"
              >
                Accept
              </Button>
              <Button
                onClick={handleDecline}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 text-xs px-3 h-8"
              >
                Decline
              </Button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
