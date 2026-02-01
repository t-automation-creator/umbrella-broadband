import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

// Helper to generate slug from title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Fallback static posts for when database is empty
const staticPosts = [
  {
    id: 1,
    title: "PSTN Switch-Off 2027: UK VoIP Migration Guide",
    slug: "pstn-switch-off-2027-uk-voip-migration-guide",
    excerpt: "The UK's PSTN switch-off by January 2027 mandates all businesses migrate from analogue landlines to VoIP. Learn how Umbrella Broadband offers seamless connectivity and managed services for a smooth digital transition.",
    createdAt: new Date("2026-01-19"),
    author: "Umbrella Broadband Team",
    category: "Business Solutions",
    imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 2,
    title: "UK Leaseholders: New Rights for Faster Broadband & Connectivity",
    slug: "uk-leaseholders-new-rights-for-faster-broadband-connectivity",
    excerpt: "The UK government is consulting on new rights for leaseholders to access better broadband. Discover how this could impact property owners, residents, and connectivity in multi-dwelling units.",
    createdAt: new Date("2026-01-09"),
    author: "Umbrella Broadband Team",
    category: "Industry News",
    imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 3,
    title: "5 Ways Managed WiFi Reduces Landlord Headaches and Improves UK Properties",
    slug: "5-ways-managed-wifi-reduces-landlord-headaches-and-improves-uk-properties",
    excerpt: "Discover how implementing a professionally managed WiFi solution can drastically cut down on common landlord issues, boost property value, and enhance tenant satisfaction in the UK.",
    createdAt: new Date("2025-12-17"),
    author: "Umbrella Broadband Team",
    category: "Property Management",
    imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 4,
    title: "5G vs Fibre: What's Best for Your Development?",
    slug: "5g-vs-fibre-whats-best-for-your-development",
    excerpt: "Comparing the pros and cons of 5G connectivity versus traditional fibre optics for new property developments.",
    createdAt: new Date("2024-08-22"),
    author: "Network Engineering",
    category: "Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "The Role of Connectivity in Student Satisfaction",
    slug: "the-role-of-connectivity-in-student-satisfaction",
    excerpt: "Recent surveys show that internet speed and reliability are top factors for students choosing accommodation.",
    createdAt: new Date("2024-08-05"),
    author: "Student Services",
    category: "Student Living",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Understanding VoIP Benefits for SMEs",
    slug: "understanding-voip-benefits-for-smes",
    excerpt: "Switching to VoIP can save businesses money while offering superior flexibility. We break down the key advantages.",
    createdAt: new Date("2024-07-18"),
    author: "Sales Team",
    category: "Business Solutions",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Blog() {
  const { data: dbPosts, isLoading } = trpc.blog.list.useQuery();
  
  // Use database posts if available, otherwise use static fallback
  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : staticPosts;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get slug for a post (use slug field if available, otherwise generate from title)
  const getPostSlug = (post: typeof posts[number]) => {
    if ('slug' in post && post.slug) {
      return post.slug;
    }
    return generateSlug(post.title);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Blog | Latest News & Insights | Umbrella Broadband" 
        description="Stay updated with the latest news, industry trends, and insights from Umbrella Broadband. Read our blog for expert advice."
        keywords="broadband news UK, connectivity insights, business internet blog, technology updates"
      />
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">Latest News & Insights</h1>
            <p className="text-lg text-gray-200">
              Stay updated with the latest trends in connectivity, security, and smart technology.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-primary mb-8 font-heading">Recent Articles</h2>
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
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <Link href={`/blog/${getPostSlug(post)}`} className="block">
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        {post.imageUrl ? (
                          <img 
                            loading="lazy" 
                            src={post.imageUrl}
                            alt={post.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        {post.category && (
                          <span className="text-secondary font-semibold">{post.category}</span>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                      <Link href={`/blog/${getPostSlug(post)}`}>
                        <h3 className="text-xl font-bold text-primary mb-3 font-heading line-clamp-2 hover:text-secondary transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        {post.author && (
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </div>
                        )}
                        <Link 
                          href={`/blog/${getPostSlug(post)}`}
                          className="text-secondary font-semibold flex items-center hover:text-primary transition-colors ml-auto"
                        >
                          Read {post.title} article <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {posts.length > 6 && (
              <div className="mt-12 text-center">
                <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white">
                  Load More Articles
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
