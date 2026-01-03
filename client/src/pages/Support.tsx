import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Phone, 
  Mail, 
  CheckCircle2,
  Headphones,
  Clock,
  FileText,
  ArrowRight
} from "lucide-react";

interface FaultFormData {
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  macAddress: string;
  faultSummary: string;
  faultDetails: string;
}

export default function Support() {
  const [formData, setFormData] = useState<FaultFormData>({
    address: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    macAddress: "",
    faultSummary: "",
    faultDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitSupportMutation = trpc.chat.submitSupportTicket.useMutation({
    onSuccess: () => {
      toast.success("Fault report submitted successfully!");
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit fault report. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.contactName || !formData.contactPhone || !formData.contactEmail || !formData.faultSummary || !formData.faultDetails) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    submitSupportMutation.mutate({
      name: formData.contactName,
      email: formData.contactEmail,
      phone: formData.contactPhone,
      propertyAddress: formData.address,
      issueType: "Fault Report",
      urgency: "medium",
      description: `MAC Address: ${formData.macAddress || "Not provided"}\n\nFault Summary: ${formData.faultSummary}\n\nFault Details: ${formData.faultDetails}`,
      conversationSummary: "Submitted via Support Page Fault Report Form",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <SEO 
          title="Technical Support | Umbrella Broadband"
          description="Report a fault or get technical support from Umbrella Broadband. Our dedicated support team ensures quick resolution of any technical issues."
          keywords="technical support, fault reporting, broadband support, network issues, UK broadband help"
        />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Headphones className="w-4 h-4" />
                Technical Support
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading">
                Technical Support & <span className="text-secondary">Fault Reporting</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
                At Umbrella Broadband, we are committed to providing reliable service and ensuring any technical issues are resolved as quickly as possible. To streamline support requests and improve efficiency, we operate a dedicated support ticket system.
              </p>
            </div>
          </div>
        </section>

        {/* How to Report Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                  How to Report a Fault
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  If you experience any technical issues, please <strong>raise a fault</strong> through our <strong>Fault Reporting System</strong>. Every report is logged and reviewed by our support team to ensure a prompt resolution.
                </p>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  You can also contact us on: <a href="tel:01926298866" className="font-bold text-primary hover:text-secondary transition-colors whitespace-nowrap">01926 29 88 66</a>
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">
                  What Happens Next?
                </h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Your request will be recorded and assessed by our technical team.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">If further information is required, we will contact you directly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">You can check the status of your request by contacting our office and providing your full name and address.</span>
                  </li>
                </ul>

                {/* Contact Info Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <Phone className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                    <a href="tel:01926298866" className="text-primary hover:text-secondary transition-colors font-medium">
                      01926 298866
                    </a>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <Mail className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                    <a href="mailto:support@umbrella-broadband.co.uk" className="text-primary hover:text-secondary transition-colors font-medium text-sm whitespace-nowrap">
                      support@umbrella-broadband.co.uk
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Fault Report Submitted</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for submitting your fault report. Our technical team will review it and get back to you as soon as possible.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Submit Another Report
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-gray-900 font-heading">Report a Fault</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Please fill in the following information to raise a fault ticket:
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Address */}
                      <div>
                        <Label htmlFor="address" className="text-gray-700 font-medium">
                          Address <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-sm text-gray-500 mb-2">Please supply your full address including postcode</p>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your full address"
                          maxLength={255}
                          required
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{formData.address.length}/255</p>
                      </div>

                      {/* Contact Name */}
                      <div>
                        <Label htmlFor="contactName" className="text-gray-700 font-medium">
                          Contact Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      {/* Contact Phone */}
                      <div>
                        <Label htmlFor="contactPhone" className="text-gray-700 font-medium">
                          Contact Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex">
                          <div className="flex items-center gap-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-md px-3">
                            <span className="text-sm">🇬🇧</span>
                            <span className="text-sm text-gray-600">(+44)</span>
                          </div>
                          <Input
                            id="contactPhone"
                            name="contactPhone"
                            type="tel"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="rounded-l-none"
                            required
                          />
                        </div>
                      </div>

                      {/* Contact Email */}
                      <div>
                        <Label htmlFor="contactEmail" className="text-gray-700 font-medium">
                          Contact Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      {/* MAC Address */}
                      <div>
                        <Label htmlFor="macAddress" className="text-gray-700 font-medium">
                          Device MAC Address
                        </Label>
                        <p className="text-sm text-gray-500 mb-2">Help us locate your device by sharing your MAC address.</p>
                        <div className="text-xs text-gray-500 mb-2 space-y-1">
                          <p>To find your iPhone MAC address → go to Settings → General → About → the Wi-Fi address.</p>
                          <p>To find your Android MAC address → Swipe down from the top of the screen → tap the gear icon → Scroll down to About [device] → Status</p>
                          <p className="mt-2">Please also disable MAC Randomization or Private Wi-Fi Addresses: <a href="https://support.apple.com/en-gb/HT211227" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">for iPhone</a> or <a href="https://support.google.com/android/answer/9930236" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">for Android</a></p>
                        </div>
                        <Input
                          id="macAddress"
                          name="macAddress"
                          value={formData.macAddress}
                          onChange={handleChange}
                          placeholder="e.g., AA:BB:CC:DD:EE:FF"
                        />
                      </div>

                      {/* Fault Summary */}
                      <div>
                        <Label htmlFor="faultSummary" className="text-gray-700 font-medium">
                          Fault Summary <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-sm text-gray-500 mb-2">Give us a short description of your fault:</p>
                        <Input
                          id="faultSummary"
                          name="faultSummary"
                          value={formData.faultSummary}
                          onChange={handleChange}
                          placeholder="Brief description of the issue"
                          required
                        />
                      </div>

                      {/* Fault Details */}
                      <div>
                        <Label htmlFor="faultDetails" className="text-gray-700 font-medium">
                          Fault Details <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-sm text-gray-500 mb-2">Give us details regarding your fault:</p>
                        <Textarea
                          id="faultDetails"
                          name="faultDetails"
                          value={formData.faultDetails}
                          onChange={handleChange}
                          placeholder="Please provide as much detail as possible about the issue you're experiencing"
                          rows={5}
                          maxLength={2000}
                          required
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{formData.faultDetails.length}/2000</p>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
                We're committed to providing outstanding service across all sectors
              </h2>
              <p className="text-lg text-gray-200 mb-8">
                Contact us today to learn how our broadband solutions can meet your needs.
              </p>
              <Link href="/contact">
                <span className="btn btn-secondary cursor-pointer inline-flex items-center gap-2">
                  Get In Touch Here
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
