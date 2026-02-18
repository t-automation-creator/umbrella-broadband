import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Fetch all documentation
  const { data: allDocs, isLoading: isLoadingAll } = trpc.admin.documentation.getAll.useQuery();

  // Search documentation
  const { data: searchResults, isLoading: isSearching } = trpc.admin.documentation.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const docs = searchQuery.length > 0 ? searchResults : allDocs;
  const isLoading = isLoadingAll || isSearching;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Search and manage site documentation. This includes all handover information and updates when content changes.
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, content, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : docs && docs.length > 0 ? (
          docs.map((doc: any) => (
            <Card
              key={doc.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedSection(selectedSection === doc.id ? null : doc.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    {doc.matchType && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Match type: <span className="font-semibold">{doc.matchType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              {selectedSection === doc.id && (
                <CardContent className="space-y-4">
                  {doc.content && (
                    <div>
                      <h4 className="font-semibold mb-2">Content</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{doc.content}</p>
                    </div>
                  )}
                  {doc.items && Array.isArray(doc.items) && doc.items.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Items</h4>
                      <ul className="space-y-2">
                        {doc.items.map((item: any, idx: number) => (
                          <li key={idx} className="text-sm border-l-2 border-primary pl-3">
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                            )}
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                {item.url}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {doc.keywords && Array.isArray(doc.keywords) && doc.keywords.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {doc.keywords.map((keyword: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
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
              <p className="text-muted-foreground">
                {searchQuery.length > 0 ? "No documentation found matching your search." : "No documentation available."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
