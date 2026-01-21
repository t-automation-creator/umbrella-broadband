import { Building2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function CaseStudyPreview() {
  const { data: caseStudies, isLoading } = trpc.caseStudies.list.useQuery();
  
  // Get the first 3 case studies for preview
  const previewStudies = caseStudies?.slice(0, 3) || [];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">
            Read Our Success Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how we've helped businesses and organizations achieve reliable, high-speed connectivity and security solutions.
          </p>
        </div>

        {/* Case Studies Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : previewStudies.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {previewStudies.map((study) => (
              <article key={study.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col">
                <Link href={`/case-studies/${study.slug}`} className="block">
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                    {study.imageUrl ? (
                      <img 
                        loading="lazy" 
                        src={study.imageUrl} 
                        alt={study.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  {study.industry && (
                    <span className="text-secondary font-semibold text-sm mb-2 block">
                      {study.industry}
                    </span>
                  )}
                  <Link href={`/case-studies/${study.slug}`}>
                    <h3 className="text-lg font-bold text-primary mb-2 font-heading line-clamp-2 group-hover:text-secondary transition-colors">
                      {study.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {study.clientName}
                  </p>
                  <Link 
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center text-secondary font-medium text-sm group-hover:gap-2 transition-all mt-auto"
                  >
                    View {study.title} case study <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Building2 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Case studies coming soon</h3>
            <p className="text-gray-500">Check back for client success stories.</p>
          </div>
        )}

        {/* View All Button */}
        {previewStudies.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/case-studies">
              <span className="btn btn-primary inline-flex items-center gap-2 cursor-pointer">
                View All Case Studies <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
