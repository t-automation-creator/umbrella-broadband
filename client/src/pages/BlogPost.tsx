import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <SEO title="Post Not Found" description="The blog post you're looking for doesn't exist." />
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4 font-heading">Post Not Found</h1>
            <p className="text-gray-600 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog" className="btn btn-primary">
              Back to Blog
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
        title={post.title} 
        description={post.excerpt || `Read ${post.title} on Umbrella Broadband blog.`}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 md:py-20">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            {post.category && (
              <div className="flex items-center mb-4">
                <Tag className="w-4 h-4 mr-2 text-secondary" />
                <span className="text-secondary font-semibold">{post.category}</span>
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-heading leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              {post.author && (
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>{post.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-secondary pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              {post.content ? (
                <div 
                  className="text-gray-700 leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content
                      .split('\n\n')
                      .map(p => `<p>${p}</p>`)
                      .join('') 
                  }}
                />
              ) : (
                <p className="text-gray-600">
                  {post.excerpt || "No content available for this post."}
                </p>
              )}
            </div>

            {/* Share & Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-primary hover:text-secondary transition-colors font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Posts
                </Link>
                
                <Link 
                  href="/contact" 
                  className="btn btn-primary"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 font-heading">
              Need Expert Connectivity Solutions?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a landlord, business owner, or property developer, we have the right solution for your connectivity needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions" className="btn btn-primary">
                View Our Solutions
              </Link>
              <Link href="/contact" className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
