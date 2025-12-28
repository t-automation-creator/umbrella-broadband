import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, CheckCircle, Linkedin } from "lucide-react";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const createMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || "Failed to send message. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    createMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      company: formData.company.trim() || undefined,
      message: formData.message.trim()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Contact Umbrella Broadband | Get in Touch Today" 
        description="Get in touch with Umbrella Broadband for expert advice on your connectivity needs. Call us, email us, or visit our office in Leamington Spa."
        keywords="contact Umbrella Broadband, broadband enquiries UK, Leamington Spa IT support, business internet contact"
      />
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">Get in Touch</h1>
            <p className="text-lg text-gray-200">
              Have a question or need support? Our team is here to help. Reach out to us today.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-primary mb-6 font-heading">Contact Information</h2>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <MapPin className="w-6 h-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <span className="block font-semibold text-gray-800">Address</span>
                        <span className="text-gray-600">46 Bath Street,<br />Leamington Spa, CV31 3AE</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Phone className="w-6 h-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <span className="block font-semibold text-gray-800">Phone</span>
                        <a href="tel:01926298866" className="text-gray-600 hover:text-secondary transition-colors">01926 298866</a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="w-6 h-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <span className="block font-semibold text-gray-800">Email</span>
                        <a href="mailto:enquiries@umbrella-broadband.co.uk" className="text-gray-600 hover:text-secondary transition-colors">enquiries@umbrella-broadband.co.uk</a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="w-6 h-6 text-secondary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <span className="block font-semibold text-gray-800">Office Hours</span>
                        <span className="text-gray-600">Mon - Fri: 9:00 AM - 5:30 PM</span>
                      </div>
                    </li>
                  </ul>
                  
                  {/* Social Media Links */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
                    <div className="flex items-center gap-3">
                      <a 
                        href="https://www.linkedin.com/company/umbrella-broadband-ltd" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary hover:bg-secondary rounded-full flex items-center justify-center transition-colors text-white"
                        aria-label="Follow us on LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://x.com/umbrellabroadband" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary hover:bg-secondary rounded-full flex items-center justify-center transition-colors text-white"
                        aria-label="Follow us on X"
                      >
                        <XIcon className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
                  {submitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-primary mb-4 font-heading">Thank You!</h3>
                      <p className="text-gray-600 mb-6">
                        Your message has been received. We'll get back to you within 24 hours.
                      </p>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-primary mb-6 font-heading">Send us a Message</h3>
                      <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <input 
                              type="text" 
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                            <input 
                              type="email" 
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input 
                              type="tel" 
                              id="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                              placeholder="07700 900000"
                            />
                          </div>
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input 
                              type="text" 
                              id="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                              placeholder="Your company name"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                          <textarea 
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5} 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all resize-none"
                            placeholder="How can we help you?"
                            required
                          ></textarea>
                        </div>
                        <button 
                          type="submit" 
                          className="btn btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? "Sending..." : "Send Message"}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
