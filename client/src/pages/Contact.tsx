import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Contact Us" 
        description="Get in touch with Umbrella Broadband for expert advice on your connectivity needs. Call us, email us, or visit our office in Leamington Spa."
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
                  <h3 className="text-xl font-bold text-primary mb-6 font-heading">Contact Information</h3>
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
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-bold text-primary mb-6 font-heading">Send us a Message</h3>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                          placeholder="07700 900000"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <select 
                          id="subject" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all bg-white"
                        >
                          <option value="">Select a topic...</option>
                          <option value="sales">Sales Enquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea 
                        id="message" 
                        rows={5} 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full md:w-auto">
                      Send Message
                    </button>
                  </form>
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
