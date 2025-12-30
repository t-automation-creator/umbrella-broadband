import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, Send, Bot, User, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Page-specific welcome messages
const getWelcomeMessage = (pathname: string): string => {
  const messages: Record<string, string> = {
    "/": "Hi! 👋 Welcome to Umbrella Broadband. What are you looking for today? I can help with broadband, VoIP, security, or property management solutions.",
    "/about": "Hi! 👋 I see you're learning about us. What are you looking for? I'm happy to answer any questions about Umbrella Broadband.",
    "/sectors": "Hi! 👋 What type of property are you looking for solutions for? We work with landlords, student accommodation, developers, and businesses.",
    "/sectors/landlords": "Hi! 👋 What are you looking for? I can help with broadband, VoIP, security, or management solutions for your rental properties.",
    "/sectors/students": "Hi! 👋 What are you looking for? I can help with solutions designed for student accommodation.",
    "/sectors/developers": "Hi! 👋 What are you looking for? I can help with infrastructure planning for your development project.",
    "/sectors/sme": "Hi! 👋 What are you looking for? I can help with broadband, phone systems, or security for your business.",
    "/solutions": "Hi! 👋 What are you looking for? We offer managed broadband, VoIP phone systems, CCTV & security, and ongoing management.",
    "/solutions/broadband": "Hi! 👋 What are you looking for? I can help with questions about our managed broadband service.",
    "/solutions/voip": "Hi! 👋 What are you looking for? I can help with questions about our VoIP phone systems.",
    "/solutions/security": "Hi! 👋 What are you looking for? I can help with CCTV, access control, or video intercom questions.",
    "/solutions/management": "Hi! 👋 What are you looking for? I can help with questions about our ongoing management services.",
    "/case-studies": "Hi! 👋 What are you looking for? I can discuss how we could achieve similar results for your property.",
    "/blog": "Hi! 👋 What are you looking for? I'm happy to answer questions about what you're reading or our services.",
    "/contact": "Hi! 👋 What are you looking for? I can answer any questions before you get in touch with our team.",
  };

  // Check for exact match first
  if (messages[pathname]) {
    return messages[pathname];
  }

  // Check for partial matches (for dynamic routes like /blog/slug)
  if (pathname.startsWith("/blog/")) {
    return "Hi! 👋 What are you looking for? I'm happy to answer questions about this article or our services.";
  }
  if (pathname.startsWith("/case-studies/")) {
    return "Hi! 👋 What are you looking for? I can discuss how we could achieve similar results for your property.";
  }
  if (pathname.startsWith("/sectors/")) {
    return "Hi! 👋 What are you looking for? I can help with solutions for your sector.";
  }
  if (pathname.startsWith("/solutions/")) {
    return "Hi! 👋 What are you looking for? I can help with questions about this solution.";
  }

  // Default fallback
  return "Hi! 👋 Welcome to Umbrella Broadband. What are you looking for today?";
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

interface CallbackFormData {
  name: string;
  phone: string;
  preferredTime: string;
  notes: string;
}

interface SupportFormData {
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  issueType: string;
  urgency: "low" | "medium" | "high" | "critical";
  description: string;
}

const quickReplies = [
  { label: "Get a quote", action: "quote" },
  { label: "Schedule a callback", action: "callback" },
  { label: "I need support", action: "support" },
  { label: "Speak to someone", action: "speak" },
];

export default function ChatBot() {
  const [location] = useLocation();
  
  // Don't render chatbot on admin pages
  if (location.startsWith('/admin')) {
    return null;
  }
  
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
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackFormData, setCallbackFormData] = useState<CallbackFormData>({
    name: "",
    phone: "",
    preferredTime: "",
    notes: "",
  });
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportFormData, setSupportFormData] = useState<SupportFormData>({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    issueType: "",
    urgency: "medium",
    description: "",
  });
  const [hasAutoOpened, setHasAutoOpened] = useState(() => {
    // Check if chat was already auto-opened this session
    return sessionStorage.getItem('chatbot-auto-opened') === 'true';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open chatbot after 45 seconds (only once per session)
  useEffect(() => {
    if (hasAutoOpened || isOpen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
      sessionStorage.setItem('chatbot-auto-opened', 'true');
    }, 45000); // 45 seconds

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
      if (data.showSupportForm) {
        setShowSupportForm(true);
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

  const submitSupportMutation = trpc.chat.submitSupportTicket.useMutation({
    onSuccess: () => {
      toast.success("Support ticket submitted! Our team will respond shortly.");
      setShowSupportForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Your support ticket has been submitted. Our technical team will review it and get back to you as soon as possible. You'll receive a response at the email address you provided. Is there anything else I can help with?",
        },
      ]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit support ticket. Please try again.");
    },
  });

  const submitCallbackMutation = trpc.chat.submitCallback.useMutation({
    onSuccess: () => {
      toast.success("Callback request submitted! We'll call you soon.");
      setShowCallbackForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Your callback request has been submitted. One of our team will call you at the time you requested. Is there anything else I can help with in the meantime?",
        },
      ]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit callback request. Please try again.");
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

  const handleQuickReply = (action: string) => {
    setShowQuickReplies(false);
    
    switch (action) {
      case "quote":
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "I'd like to get a quote" },
        ]);
        setShowLeadForm(true);
        break;
      case "callback":
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "I'd like to schedule a callback" },
          { role: "assistant", content: "I'd be happy to arrange a callback for you. Please fill in your details below and let us know when would be a good time to call." },
        ]);
        setShowCallbackForm(true);
        break;
      case "pricing":
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "I'd like to learn about pricing" },
        ]);
        sendMessageMutation.mutate({
          message: "What are your prices? Can you tell me about your pricing?",
          conversationHistory: [],
        });
        break;
      case "support":
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "I need technical support" },
          { role: "assistant", content: "I'm sorry to hear you're having issues. Please fill in the support form below and our technical team will get back to you as soon as possible." },
        ]);
        setShowSupportForm(true);
        break;
      case "speak":
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "I'd like to speak to someone" },
          { role: "assistant", content: "You can reach our team directly:\n\n📞 Call: 01926 298866\n📧 Email: enquiries@umbrella-broadband.co.uk\n\nOr fill in your details below and we'll call you back." },
        ]);
        setShowCallbackForm(true);
        break;
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackFormData.phone) {
      toast.error("Please provide a phone number");
      return;
    }

    // Generate conversation summary
    const conversationSummary = `CALLBACK REQUEST\nPreferred time: ${callbackFormData.preferredTime || "Not specified"}\nNotes: ${callbackFormData.notes || "None"}\n\n` + messages
      .slice(1)
      .map((m) => `${m.role === "user" ? "Customer" : "Bot"}: ${m.content}`)
      .join("\n");

    submitCallbackMutation.mutate({
      name: callbackFormData.name,
      phone: callbackFormData.phone,
      preferredTime: callbackFormData.preferredTime,
      notes: callbackFormData.notes,
    });
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportFormData.email) {
      toast.error("Please provide an email address");
      return;
    }
    if (!supportFormData.description) {
      toast.error("Please describe your issue");
      return;
    }

    // Generate conversation summary
    const conversationSummary = messages
      .slice(1)
      .map((m) => `${m.role === "user" ? "Customer" : "Bot"}: ${m.content}`)
      .join("\n");

    submitSupportMutation.mutate({
      ...supportFormData,
      conversationSummary,
    });
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

            {/* Quick Reply Buttons */}
            {showQuickReplies && messages.length === 1 && !showLeadForm && !showCallbackForm && (
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.action}
                    onClick={() => handleQuickReply(reply.action)}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-primary/30 text-primary rounded-full hover:bg-primary/5 transition-colors"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            )}

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

            {/* Callback Form */}
            {showCallbackForm && !leadSubmitted && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-800 mb-3">
                  Schedule a callback
                </h4>
                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <Input
                    placeholder="Your name"
                    value={callbackFormData.name}
                    onChange={(e) =>
                      setCallbackFormData({ ...callbackFormData, name: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone number *"
                    value={callbackFormData.phone}
                    onChange={(e) =>
                      setCallbackFormData({ ...callbackFormData, phone: e.target.value })
                    }
                    className="text-sm h-9"
                    required
                  />
                  <select
                    value={callbackFormData.preferredTime}
                    onChange={(e) =>
                      setCallbackFormData({
                        ...callbackFormData,
                        preferredTime: e.target.value,
                      })
                    }
                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md bg-white"
                  >
                    <option value="">Preferred time to call</option>
                    <option value="morning">Morning (9am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 5pm)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                  <Input
                    placeholder="Any notes (optional)"
                    value={callbackFormData.notes}
                    onChange={(e) =>
                      setCallbackFormData({ ...callbackFormData, notes: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCallbackForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={submitCallbackMutation.isPending}
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                    >
                      {submitCallbackMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Request Callback"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Support Form */}
            {showSupportForm && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-800 mb-3">
                  Submit a support ticket
                </h4>
                <form onSubmit={handleSupportSubmit} className="space-y-3">
                  <Input
                    placeholder="Your name *"
                    value={supportFormData.name}
                    onChange={(e) =>
                      setSupportFormData({ ...supportFormData, name: e.target.value })
                    }
                    className="text-sm h-9"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email address *"
                    value={supportFormData.email}
                    onChange={(e) =>
                      setSupportFormData({ ...supportFormData, email: e.target.value })
                    }
                    className="text-sm h-9"
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={supportFormData.phone}
                    onChange={(e) =>
                      setSupportFormData({ ...supportFormData, phone: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <Input
                    placeholder="Property address (optional)"
                    value={supportFormData.propertyAddress}
                    onChange={(e) =>
                      setSupportFormData({ ...supportFormData, propertyAddress: e.target.value })
                    }
                    className="text-sm h-9"
                  />
                  <select
                    value={supportFormData.issueType}
                    onChange={(e) =>
                      setSupportFormData({
                        ...supportFormData,
                        issueType: e.target.value,
                      })
                    }
                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md bg-white"
                  >
                    <option value="">Type of issue</option>
                    <option value="No internet connection">No internet connection</option>
                    <option value="Slow speeds">Slow speeds</option>
                    <option value="WiFi issues">WiFi issues</option>
                    <option value="VoIP/Phone issues">VoIP/Phone issues</option>
                    <option value="CCTV/Security issues">CCTV/Security issues</option>
                    <option value="Billing query">Billing query</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    value={supportFormData.urgency}
                    onChange={(e) =>
                      setSupportFormData({
                        ...supportFormData,
                        urgency: e.target.value as "low" | "medium" | "high" | "critical",
                      })
                    }
                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md bg-white"
                  >
                    <option value="low">Low - Not urgent</option>
                    <option value="medium">Medium - Affecting work</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="critical">Critical - Complete outage</option>
                  </select>
                  <textarea
                    placeholder="Describe your issue *"
                    value={supportFormData.description}
                    onChange={(e) =>
                      setSupportFormData({ ...supportFormData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white min-h-[80px] resize-none"
                    required
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSupportForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={submitSupportMutation.isPending}
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                    >
                      {submitSupportMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Submit Ticket"
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
