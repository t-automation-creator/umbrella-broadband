import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft, Tag, ExternalLink } from "lucide-react";
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
        <SEO 
          title="Loading Article | Umbrella Broadband Blog" 
          description="Read the latest news and insights from Umbrella Broadband. Expert advice on connectivity, broadband, and technology."
          keywords="broadband blog, UK connectivity news, technology insights"
        />
        <Navbar />
        <main className="flex-grow">
          <section className="bg-primary text-white py-16">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl font-bold font-heading sr-only">Loading Article</h1>
              <h2 className="text-2xl font-bold font-heading sr-only">Umbrella Broadband Blog</h2>
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
        title={`${post.title} | Umbrella Broadband Blog`} 
        description={post.excerpt ? post.excerpt.substring(0, 155) + (post.excerpt.length > 155 ? '...' : '') : `Read ${post.title} on Umbrella Broadband blog. Expert insights on connectivity and technology.`}
        keywords={`${post.category || 'broadband'} news, ${post.title.split(' ').slice(0, 3).join(' ')}, UK connectivity blog, technology insights`}
        image={post.imageUrl || "/images/og-image.jpg"}
        type="article"
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
            <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-heading prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-a:text-secondary prose-a:underline hover:prose-a:text-primary prose-strong:text-gray-900 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1">
              {post.content ? (
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content
                  }}
                />
              ) : (
                <p className="text-gray-600">
                  {post.excerpt || "No content available for this post."}
                </p>
              )}
            </div>

            {/* Sources Section */}
            {post.sources && (() => {
              try {
                const sources = JSON.parse(post.sources);
                if (Array.isArray(sources) && sources.length > 0) {
                  return (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-xl font-bold text-primary mb-4 font-heading">Sources & References</h3>
                      <ul className="space-y-2">
                        {sources.map((source: { title: string; url: string }, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gray-500 text-sm mt-1">[{index + 1}]</span>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-secondary hover:text-primary transition-colors flex items-center gap-1"
                            >
                              {source.title}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              } catch (e) {
                return null;
              }
              return null;
            })()}

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
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Related resources: <a href="https://www.b2b-directory-uk.co.uk/telecommunications.html" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-secondary transition-colors underline">UK Telecommunications Directory</a>
                </p>
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
