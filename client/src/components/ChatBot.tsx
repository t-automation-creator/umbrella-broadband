import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, Send, Loader2, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Page-specific welcome messages
const getWelcomeMessage = (pathname: string): string => {
  const messages: Record<string, string> = {
    "/": "Hello! 👋 Welcome to Umbrella Broadband. I'm here to help you find the perfect connectivity solution for your property. Whether you manage HMOs, student accommodation, or commercial spaces - I can answer your questions. What can I help you with today?",
    "/about": "Hello! 👋 I see you're learning about Umbrella Broadband. We've been providing managed connectivity solutions across the UK for years. Have any questions about our company or how we work?",
    "/sectors": "Hello! 👋 Looking for sector-specific solutions? We specialise in landlords, HMOs, student accommodation, property developers, and SME businesses. Which sector are you interested in?",
    "/sectors/landlords": "Hello! 👋 As a landlord, reliable broadband can be a real differentiator for your properties. I can help you understand our managed WiFi solutions for HMOs and rental properties. What would you like to know?",
    "/sectors/students": "Hello! 👋 Student accommodation needs robust, high-speed connectivity. Our solutions are designed to handle high-density usage with fair bandwidth allocation. How can I help you today?",
    "/sectors/developers": "Hello! 👋 Planning connectivity for a new development? We work with property developers from the design stage to ensure future-proof network infrastructure. What's your project?",
    "/sectors/sme": "Hello! 👋 Looking for business connectivity? Our SME solutions include managed broadband, VoIP phone systems, and security. What does your business need?",
    "/solutions": "Hello! 👋 Exploring our solutions? We offer managed broadband, VoIP phone systems, CCTV & security, and ongoing management services. Which solution interests you most?",
    "/solutions/broadband": "Hello! 👋 Our managed broadband service includes installation, monitoring, and 24/7 support. I can help you understand what's included and get a quote. What would you like to know?",
    "/solutions/voip": "Hello! 👋 Interested in our VoIP phone systems? We provide modern business phone solutions that integrate with your broadband. Any questions about features or pricing?",
    "/solutions/security": "Hello! 👋 Looking at our security solutions? We offer CCTV, access control, and video intercom systems - all professionally installed and monitored. How can I help?",
    "/solutions/management": "Hello! 👋 Our management services include proactive monitoring, maintenance, and support for all your connectivity infrastructure. Want to know more about what's included?",
    "/case-studies": "Hello! 👋 Looking at our case studies? These show real results we've achieved for clients like you. If you'd like to discuss how we could help your property, I'm here!",
    "/blog": "Hello! 👋 Browsing our blog? We share insights on broadband, property technology, and connectivity tips. If you have any questions about what you're reading, just ask!",
    "/contact": "Hello! 👋 Ready to get in touch? I can help answer any final questions before you reach out, or you can fill in the contact form. What would you like to know?",
  };

  // Check for exact match first
  if (messages[pathname]) {
    return messages[pathname];
  }

  // Check for partial matches (for dynamic routes like /blog/slug)
  if (pathname.startsWith("/blog/")) {
    return "Hello! 👋 I hope you're enjoying this article! If you have any questions about the topic or our services, I'm happy to help.";
  }
  if (pathname.startsWith("/case-studies/")) {
    return "Hello! 👋 Great choice looking at this case study! If you'd like to discuss how we could achieve similar results for your property, let me know.";
  }
  if (pathname.startsWith("/sectors/")) {
    return "Hello! 👋 I see you're exploring our sector solutions. I can help answer any questions about how we serve this market. What would you like to know?";
  }
  if (pathname.startsWith("/solutions/")) {
    return "Hello! 👋 Interested in this solution? I can provide more details or help you get a quote. What questions do you have?";
  }

  // Default fallback
  return "Hello! 👋 I'm here to help you with any questions about Umbrella Broadband's services. Whether you're interested in managed broadband, VoIP, security solutions, or have questions about our coverage - I'm happy to assist. How can I help you today?";
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  propertyType: string;
}

export default function ChatBot() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getWelcomeMessage(location),
    },
  ]);

  // Update welcome message when page changes (if chat hasn't been used yet)
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([{ role: "assistant", content: getWelcomeMessage(location) }]);
    }
  }, [location]);
  const [inputValue, setInputValue] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "",
    propertyType: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(() => {
    // Check if chat was already auto-opened this session
    return sessionStorage.getItem('chatbot-auto-opened') === 'true';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open chatbot after 10 seconds (only once per session)
  useEffect(() => {
    if (hasAutoOpened || isOpen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
      sessionStorage.setItem('chatbot-auto-opened', 'true');
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [hasAutoOpened, isOpen]);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      if (data.showLeadCapture && !leadSubmitted) {
        setShowLeadForm(true);
      }
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologise, I'm having trouble responding. Please call us on 01926 298866 or email enquiries@umbrella-broadband.co.uk.",
        },
      ]);
    },
  });

  const submitLeadMutation = trpc.chat.submitLead.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Our team will be in touch shortly.");
      setShowLeadForm(false);
      setLeadSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Thank you for your details! One of our team members will be in touch with you shortly to discuss your requirements. Is there anything else I can help you with in the meantime?",
        },
      ]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit. Please try again.");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showLeadForm]);

  const handleSend = () => {
    if (!inputValue.trim() || sendMessageMutation.isPending) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Get conversation history (excluding the welcome message)
    const conversationHistory = messages.slice(1).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    sendMessageMutation.mutate({
      message: userMessage,
      conversationHistory,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFormData.email && !leadFormData.phone) {
      toast.error("Please provide an email or phone number");
      return;
    }

    // Generate conversation summary
    const conversationSummary = messages
      .slice(1)
      .map((m) => `${m.role === "user" ? "Customer" : "Bot"}: ${m.content}`)
      .join("\n");

    submitLeadMutation.mutate({
      ...leadFormData,
      conversationSummary,
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-secondary hover:bg-secondary/90"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Umbrella Broadband</h3>
              <p className="text-xs text-white/80">Online • Usually replies instantly</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[300px] bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {sendMessageMutation.isPending && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}

            {/* Lead Capture Form */}
            {showLeadForm && !leadSubmitted && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-800 mb-3">
                  Get a personalised quote
                </h4>
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <Input
                    placeholder="Your name"
                    value={leadFormData.name}
                    onChange={(e) =>
                      setLeadFormData({ ...leadFormData, name: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={leadFormData.email}
                    onChange={(e) =>
                      setLeadFormData({ ...leadFormData, email: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={leadFormData.phone}
                    onChange={(e) =>
                      setLeadFormData({ ...leadFormData, phone: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <Input
                    placeholder="Company name (optional)"
                    value={leadFormData.company}
                    onChange={(e) =>
                      setLeadFormData({ ...leadFormData, company: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <select
                    value={leadFormData.serviceInterest}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        serviceInterest: e.target.value,
                      })
                    }
                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md bg-white"
                  >
                    <option value="">Service of interest</option>
                    <option value="broadband">Managed Broadband</option>
                    <option value="voip">VoIP Phone Systems</option>
                    <option value="security">CCTV & Security</option>
                    <option value="management">Management Services</option>
                    <option value="multiple">Multiple Services</option>
                  </select>
                  <select
                    value={leadFormData.propertyType}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        propertyType: e.target.value,
                      })
                    }
                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md bg-white"
                  >
                    <option value="">Property type</option>
                    <option value="hmo">HMO (House in Multiple Occupation)</option>
                    <option value="student">Student Accommodation</option>
                    <option value="commercial">Commercial Property</option>
                    <option value="residential">Residential Development</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLeadForm(false)}
                      className="flex-1"
                    >
                      Maybe later
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={submitLeadMutation.isPending}
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                    >
                      {submitLeadMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Get Quote"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={sendMessageMutation.isPending}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || sendMessageMutation.isPending}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Powered by AI • Call 01926 298866 for immediate assistance
            </p>
          </div>
        </div>
      )}
    </>
  );
}
