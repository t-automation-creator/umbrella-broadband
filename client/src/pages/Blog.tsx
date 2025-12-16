import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "The Future of Smart Buildings: IoT Integration",
      excerpt: "Discover how Internet of Things (IoT) technology is transforming residential and commercial properties into intelligent, efficient ecosystems.",
      date: "October 15, 2024",
      author: "Tech Team",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Why Managed Wi-Fi is Essential for HMOs",
      excerpt: "Landlords are increasingly turning to managed Wi-Fi solutions to attract tenants and reduce maintenance headaches. Here's why.",
      date: "September 28, 2024",
      author: "Sarah Jenkins",
      category: "Property Management",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Securing Your Business Network in 2025",
      excerpt: "Cyber threats are evolving. Learn about the latest security protocols and hardware necessary to protect your business data.",
      date: "September 10, 2024",
      author: "Security Ops",
      category: "Cyber Security",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 4,
      title: "5G vs Fibre: What's Best for Your Development?",
      excerpt: "Comparing the pros and cons of 5G connectivity versus traditional fibre optics for new property developments.",
      date: "August 22, 2024",
      author: "Network Engineering",
      category: "Infrastructure",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 5,
      title: "The Role of Connectivity in Student Satisfaction",
      excerpt: "Recent surveys show that internet speed and reliability are top factors for students choosing accommodation.",
      date: "August 05, 2024",
      author: "Student Services",
      category: "Student Living",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 6,
      title: "Understanding VoIP Benefits for SMEs",
      excerpt: "Switching to VoIP can save businesses money while offering superior flexibility. We break down the key advantages.",
      date: "July 18, 2024",
      author: "Sales Team",
      category: "Business Solutions",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO 
        title="Latest News & Insights" 
        description="Stay updated with the latest news, industry trends, and insights from Umbrella Broadband. Read our blog for expert advice."
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <span className="text-secondary font-semibold">{post.category}</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3 font-heading line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <button className="text-secondary font-semibold flex items-center hover:text-primary transition-colors">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white">
                Load More Articles
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
