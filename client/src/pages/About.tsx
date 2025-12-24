import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Award, Layers, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="About Us | Umbrella Broadband" 
        description="Learn about Umbrella Broadband's mission to deliver seamless, high-speed internet and security solutions. We are dedicated to keeping you connected."
        keywords="about umbrella broadband, UK internet provider, managed broadband company, connectivity solutions provider, business internet company, student internet provider, landlord broadband partner"
      />
      <Navbar />
      <main className="flex-grow">
        {/* About Hero */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6 font-heading">About Umbrella Broadband</h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Welcome to Umbrella Broadband, a leading provider of tailored Connectivity, Technology and Security Solutions. Building upon the success of our sister company, Student Internet, we have been delivering fully managed broadband services to students, landlords, and developers across the UK.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Starting in Leamington Spa, we recognised the need for reliable, fully managed broadband services. Our rapid expansion led to partnerships with landlords, developers, and businesses looking for seamless connectivity solutions.
                </p>
                <Link href="/contact">
                  <span className="btn btn-primary cursor-pointer">Work With Us</span>
                </Link>
              </div>
              <div className="relative">
                <img loading="lazy" src="/images/about-hero.png" 
                  alt="Our Team" 
                  className="w-full object-contain" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                <img loading="lazy" src="/images/icons/mission-icon.png" 
                  alt="Mission" 
                  className="h-16 w-16 mx-auto mb-6" 
                />
                <h3 className="text-xl font-bold text-primary mb-3 font-heading">Our Mission</h3>
                <p className="text-gray-600">
                  To deliver reliable network infrastructure and comprehensive management services, ensuring seamless connectivity and security for modern properties.
                </p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                <img loading="lazy" src="/images/icons/vision-icon.png" 
                  alt="Vision" 
                  className="h-16 w-16 mx-auto mb-6" 
                />
                <h3 className="text-xl font-bold text-primary mb-3 font-heading">Our Vision</h3>
                <p className="text-gray-600">
                  To be the premier partner for fully managed connectivity and security solutions, empowering multi-occupancy homes and businesses with 24/7 support and maintenance.
                </p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                <img loading="lazy" src="/images/icons/values-icon.png" 
                  alt="Values" 
                  className="h-16 w-16 mx-auto mb-6" 
                />
                <h3 className="text-xl font-bold text-primary mb-3 font-heading">Our Values</h3>
                <p className="text-gray-600">
                  Be the Customer. Be Collaborative. Be Commercial. Be the Solution. We put our clients at the heart of everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img loading="lazy" src="/images/about-services.png" 
                  alt="Services" 
                  className="w-full object-contain" 
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary mb-8 font-heading">Why Choose Umbrella?</h2>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <Award className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-primary font-heading">Experience & Expertise</h3>
                      <p className="mt-2 text-gray-600">Over a decade in managed broadband services, delivering excellence across the UK.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <Layers className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-primary font-heading">End-to-End Solutions</h3>
                      <p className="mt-2 text-gray-600">From design and installation to ongoing support and maintenance, we handle everything.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-primary font-heading">Customer-First Approach</h3>
                      <p className="mt-2 text-gray-600">We work closely with clients to create bespoke solutions tailored to their specific needs.</p>
                    </div>
                  </div>
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
