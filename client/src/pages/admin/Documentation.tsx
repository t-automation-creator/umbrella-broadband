import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronDown, ChevronUp, BookOpen, FileText, Cog, Users, Mail, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryIcons: Record<string, React.ReactNode> = {
  "Overview": <BookOpen className="h-4 w-4" />,
  "Pages": <FileText className="h-4 w-4" />,
  "Features": <Cog className="h-4 w-4" />,
  "Admin": <Users className="h-4 w-4" />,
  "Technical": <Cog className="h-4 w-4" />,
  "Maintenance": <AlertCircle className="h-4 w-4" />,
};

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["intro"]));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  const categories = useMemo(() => {
    const cats = new Set<string>();
    docs.forEach((doc: any) => {
      if (doc.category) cats.add(doc.category);
    });
    return Array.from(cats).sort();
  }, [docs]);

  const filteredDocs = useMemo(() => {
    if (!activeCategory) return docs;
    return docs.filter((doc: any) => doc.category === activeCategory);
  }, [docs, activeCategory]);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">
          Complete handover guide for the Umbrella Broadband website. Search or browse by category.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search documentation by title, content, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      {!searchQuery && categories.length > 0 && (
        <div className="border-b">
          <Tabs value={activeCategory || "all"} onValueChange={(v) => setActiveCategory(v === "all" ? null : v)}>
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                All ({docs.length})
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    {categoryIcons[cat]}
                    {cat} ({docs.filter((d: any) => d.category === cat).length})
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Documentation Sections */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredDocs && filteredDocs.length > 0 ? (
          filteredDocs.map((doc: any) => (
            <Card
              key={doc.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleSection(doc.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {doc.category && (
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                          {doc.category}
                        </span>
                      )}
                      {doc.matchType && searchQuery && (
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-900 text-xs font-medium rounded">
                          Match: {doc.matchType}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {expandedSections.has(doc.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedSections.has(doc.id) && (
                <CardContent className="space-y-4 border-t pt-4">
                  {/* Content */}
                  {doc.content && (
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {doc.content}
                      </p>
                    </div>
                  )}

                  {/* Items List */}
                  {doc.items && Array.isArray(doc.items) && doc.items.length > 0 && (
                    <div className="space-y-3">
                      {doc.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="border-l-4 border-primary/30 pl-4 py-2 bg-primary/5 rounded-r"
                        >
                          <div className="font-semibold text-sm">{item.name}</div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-2 inline-block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.url} →
                            </a>
                          )}
                          {item.keywords && Array.isArray(item.keywords) && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.keywords.map((kw: string, kidx: number) => (
                                <span
                                  key={kidx}
                                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Keywords */}
                  {doc.keywords && Array.isArray(doc.keywords) && doc.keywords.length > 0 && !doc.items && (
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {doc.keywords.map((keyword: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery.length > 0
                  ? "No documentation found matching your search."
                  : "No documentation available."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
