import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Building2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = trpc.caseStudies.list.useQuery();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Case Studies" 
        description="Discover how Umbrella Broadband has helped businesses and organizations achieve reliable, high-speed connectivity. Read our client success stories."
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">Case Studies</h1>
            <p className="text-lg text-gray-200">
              Discover how we've helped businesses and organizations achieve reliable, high-speed connectivity.
            </p>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : caseStudies && caseStudies.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {caseStudies.map((study) => (
                  <article key={study.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <Link href={`/case-studies/${study.slug}`} className="block">
                      <div className="h-72 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                        {study.imageUrl ? (
                          <img 
                            src={study.imageUrl} 
                            alt={study.title} 
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-primary/30" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        {study.industry && (
                          <span className="text-secondary font-semibold">{study.industry}</span>
                        )}
                      </div>
                      <Link href={`/case-studies/${study.slug}`}>
                        <h3 className="text-xl font-bold text-primary mb-2 font-heading line-clamp-2 hover:text-secondary transition-colors">
                          {study.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 font-medium mb-3">
                        {study.clientName}
                      </p>
                      {study.challenge && (
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {study.challenge.substring(0, 150)}...
                        </p>
                      )}
                      <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100">
                        <Link 
                          href={`/case-studies/${study.slug}`}
                          className="text-secondary font-semibold flex items-center hover:text-primary transition-colors"
                        >
                          Read Case Study <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Building2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No case studies yet</h3>
                <p className="text-gray-500">Check back soon for client success stories.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 font-heading">Ready to Transform Your Connectivity?</h2>
            <p className="text-lg text-gray-200 mb-8">
              Join the growing list of businesses that trust Umbrella Broadband for their connectivity needs.
            </p>
            <Link href="/contact">
              <button className="btn bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg">
                Get in Touch
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
