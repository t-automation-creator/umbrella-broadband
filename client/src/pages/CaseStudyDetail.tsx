import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Building2, ArrowLeft, Quote, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";

export default function CaseStudyDetail() {
  const params = useParams<{ slug: string }>();
  const { data: caseStudy, isLoading, error } = trpc.caseStudies.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <SEO 
          title="Loading Case Study | Umbrella Broadband" 
          description="Discover how Umbrella Broadband helps businesses achieve reliable connectivity. Read our client success stories."
          keywords="broadband case study, UK connectivity solutions, managed broadband success"
        />
        <Navbar />
        <main className="flex-grow">
          <section className="bg-primary text-white py-16">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl font-bold font-heading sr-only">Loading Case Study</h1>
              <h2 className="text-2xl font-bold font-heading sr-only">Client Success Story</h2>
            </div>
          </section>
          <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-64 bg-gray-200 rounded" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <SEO title="Case Study Not Found" description="The case study you're looking for doesn't exist." />
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4 font-heading">Case Study Not Found</h1>
            <p className="text-gray-600 mb-8">
              The case study you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/case-studies" className="btn btn-primary">
              Back to Case Studies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title={`${caseStudy.title} | ${caseStudy.clientName} Case Study | Umbrella Broadband`} 
        description={caseStudy.challenge ? caseStudy.challenge.substring(0, 155) + '...' : `Discover how Umbrella Broadband helped ${caseStudy.clientName} achieve reliable connectivity. Read the full case study.`}
        keywords={`${caseStudy.clientName} case study, ${caseStudy.industry || 'business'} broadband, UK connectivity solutions, managed broadband success`}
        image={caseStudy.imageUrl || "/images/og-image.jpg"}
        type="article"
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 md:py-20">
            <Link 
              href="/case-studies" 
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Case Studies
            </Link>
            
            {caseStudy.industry && (
              <div className="flex items-center mb-4">
                <Building2 className="w-4 h-4 mr-2 text-secondary" />
                <span className="text-secondary font-semibold">{caseStudy.industry}</span>
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-heading leading-tight text-center md:text-left">
              {caseStudy.title}
            </h1>
            
            <p className="text-xl text-gray-200">
              Client: <span className="font-semibold text-white">{caseStudy.clientName}</span>
            </p>
          </div>
        </section>

        {/* Case Study Content */}
        <article className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* The Challenge */}
            {caseStudy.challenge && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4 font-heading flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                  The Challenge
                </h2>
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {caseStudy.challenge}
                  </p>
                </div>
              </section>
            )}

            {/* Our Solution */}
            {caseStudy.solution && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4 font-heading flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                  Our Solution
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {caseStudy.solution}
                  </p>
                </div>
              </section>
            )}

            {/* The Results */}
            {caseStudy.results && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4 font-heading flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                  The Results
                </h2>
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {caseStudy.results}
                  </p>
                </div>
              </section>
            )}

            {/* Testimonial */}
            {caseStudy.testimonial && (
              <section className="mb-12">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-xl border border-primary/10">
                  <Quote className="w-10 h-10 text-secondary mb-4" />
                  <blockquote className="text-xl text-gray-700 italic leading-relaxed mb-4">
                    "{caseStudy.testimonial}"
                  </blockquote>
                  {caseStudy.testimonialAuthor && (
                    <p className="text-primary font-semibold">
                      — {caseStudy.testimonialAuthor}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link 
                  href="/case-studies" 
                  className="inline-flex items-center text-primary hover:text-secondary transition-colors font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Case Studies
                </Link>
                
                <Link 
                  href="/contact" 
                  className="btn btn-primary"
                >
                  Start Your Project
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-primary text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
              Ready to Achieve Similar Results?
            </h2>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
              Let us help you transform your connectivity infrastructure and achieve your business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg">
                Get a Free Consultation
              </Link>
              <Link href="/solutions" className="btn border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 rounded-lg">
                View Our Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
