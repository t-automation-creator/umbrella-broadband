import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, FileText, Cog, Users, Mail, AlertCircle, ChevronRight } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Overview": <BookOpen className="h-8 w-8" />,
  "Pages": <FileText className="h-8 w-8" />,
  "Features": <Cog className="h-8 w-8" />,
  "Admin": <Users className="h-8 w-8" />,
  "Technical": <Cog className="h-8 w-8" />,
  "Maintenance": <AlertCircle className="h-8 w-8" />,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Overview": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Pages": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Features": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  "Admin": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  "Technical": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Maintenance": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all documentation
  const { data: allDocs, isLoading } = trpc.admin.documentation.getAll.useQuery();

  // Search documentation
  const { data: searchResults } = trpc.admin.documentation.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const docs = useMemo(() => {
    if (searchQuery.length > 0) {
      return searchResults || [];
    }
    return allDocs || [];
  }, [searchQuery, searchResults, allDocs]);

  // Get unique categories and group docs
  const categories = useMemo(() => {
    const catMap = new Map<string, any[]>();
    docs.forEach((doc: any) => {
      const cat = doc.category || "Other";
      if (!catMap.has(cat)) {
        catMap.set(cat, []);
      }
      catMap.get(cat)!.push(doc);
    });
    return Array.from(catMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [docs]);

  const filteredCategories = useMemo(() => {
    if (!selectedCategory) return categories;
    return categories.filter(([cat]) => cat === selectedCategory);
  }, [categories, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Documentation</h1>
            <p className="text-lg sm:text-xl text-slate-200">
              Everything you need to manage and maintain the Umbrella Broadband website.
            </p>

            {/* Search Bar */}
            <div className="mt-8 relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search the documentation..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedCategory(null);
                  }}
                  className="pl-12 pr-4 py-3 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              {searchQuery.length > 0
                ? "No documentation found matching your search."
                : "No documentation available."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map(([category, categoryDocs]) => {
              const colors = categoryColors[category] || categoryColors["Overview"];
              const icon = categoryIcons[category] || <BookOpen className="h-8 w-8" />;

              return (
                <div key={category}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <div className={colors.text}>{icon}</div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
                      <p className="text-sm text-slate-500">{categoryDocs.length} items</p>
                    </div>
                  </div>

                  {/* Category Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDocs.map((doc: any) => (
                      <Card
                        key={doc.id}
                        className={`group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${colors.border} ${colors.bg}`}
                      >
                        <CardContent className="p-6 space-y-4 h-full flex flex-col">
                          {/* Icon & Title */}
                          <div className="space-y-3">
                            <div className={`inline-flex p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                              <div className={colors.text}>{icon}</div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                              {doc.title}
                            </h3>
                          </div>

                          {/* Description */}
                          {doc.content && (
                            <p className="text-sm text-slate-600 line-clamp-3 flex-grow">
                              {doc.content}
                            </p>
                          )}

                          {/* Items Preview */}
                          {doc.items && Array.isArray(doc.items) && doc.items.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                              {doc.items.slice(0, 2).map((item: any, idx: number) => (
                                <div key={idx} className="text-xs text-slate-600">
                                  <span className="font-semibold">{item.name}</span>
                                </div>
                              ))}
                              {doc.items.length > 2 && (
                                <div className="text-xs text-slate-500 italic">
                                  +{doc.items.length - 2} more items
                                </div>
                              )}
                            </div>
                          )}

                          {/* Keywords */}
                          {doc.keywords && Array.isArray(doc.keywords) && doc.keywords.length > 0 && !doc.items && (
                            <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200">
                              {doc.keywords.slice(0, 3).map((kw: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-white text-slate-600 text-xs rounded border border-slate-200"
                                >
                                  {kw}
                                </span>
                              ))}
                              {doc.keywords.length > 3 && (
                                <span className="px-2 py-1 text-slate-500 text-xs">
                                  +{doc.keywords.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Read More Link */}
                          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm group-hover:gap-3 transition-all pt-2">
                            Read more
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
