import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  FileText,
  Cog,
  Users,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Mail,
  Globe,
  Server,
  Shield,
  BarChart3,
  Zap,
  Database,
  Link2,
  Settings,
  Layers,
  X,
  ArrowLeft,
} from "lucide-react";

/* ─── Icon & color maps ─── */
const categoryMeta: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  Overview: { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  Pages: { icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  Features: { icon: Zap, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
  Admin: { icon: Shield, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
  Technical: { icon: Server, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  Maintenance: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
};

const defaultMeta = { icon: Layers, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };

function getMeta(category: string) {
  return categoryMeta[category] || defaultMeta;
}

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ─── Data ─── */
  const { data: allDocs, isLoading } = trpc.admin.documentation.getAll.useQuery();
  const { data: searchResults } = trpc.admin.documentation.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const docs = useMemo(() => {
    if (searchQuery.length > 0) return searchResults || [];
    return allDocs || [];
  }, [searchQuery, searchResults, allDocs]);

  /* Group by category */
  const categories = useMemo(() => {
    const catMap = new Map<string, any[]>();
    docs.forEach((doc: any) => {
      const cat = doc.category || "Other";
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push(doc);
    });
    return Array.from(catMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [docs]);

  /* Expand all categories by default */
  useEffect(() => {
    if (categories.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set(categories.map(([cat]) => cat)));
    }
  }, [categories]);

  /* Selected doc */
  const selectedDoc = useMemo(() => {
    if (!selectedDocId) return null;
    return docs.find((d: any) => d.id === selectedDocId) || null;
  }, [selectedDocId, docs]);

  /* Helpers */
  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleDocSelect = (doc: any) => {
    setSelectedDocId(doc.id);
    setSidebarOpen(false);
  };

  const handleBack = () => {
    setSelectedDocId(null);
  };

  /* ─── Render ─── */
  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      {/* ── Mobile sidebar toggle ── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-[72px] left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
      </button>

      {/* ── Sidebar ── */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:relative z-40 lg:z-auto
          w-72 h-full bg-gray-50 border-r border-gray-200
          transition-transform duration-200 ease-in-out
          flex flex-col
        `}
      >
        {/* Sidebar header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-slate-700" />
            <h2 className="font-semibold text-slate-900 text-sm tracking-wide uppercase">
              Documentation
            </h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedDocId(null);
              }}
              className="pl-9 pr-3 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600" />
            </div>
          ) : categories.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              {searchQuery ? "No results found." : "No documentation."}
            </div>
          ) : (
            categories.map(([category, categoryDocs]) => {
              const meta = getMeta(category);
              const Icon = meta.icon;
              const isExpanded = expandedCategories.has(category);

              return (
                <div key={category} className="mb-1">
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 px-5 py-2.5 text-left hover:bg-gray-100 transition-colors"
                  >
                    <Icon className={`h-4 w-4 ${meta.color} shrink-0`} />
                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                      {category}
                    </span>
                    <span className="text-xs text-gray-400 mr-1">{categoryDocs.length}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "" : "-rotate-90"
                      }`}
                    />
                  </button>

                  {/* Category items */}
                  {isExpanded && (
                    <div className="ml-5 border-l border-gray-200">
                      {categoryDocs.map((doc: any) => (
                        <button
                          key={doc.id}
                          onClick={() => handleDocSelect(doc)}
                          className={`
                            w-full text-left pl-5 pr-4 py-2 text-sm transition-colors
                            ${
                              selectedDocId === doc.id
                                ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 -ml-px"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }
                          `}
                        >
                          <span className="line-clamp-1">{doc.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        {!selectedDoc ? (
          /* ── Landing / Overview ── */
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                How can we help?
              </h1>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                Everything you need to manage and maintain the Umbrella Broadband website.
              </p>
            </div>

            {/* Category cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(([category, categoryDocs]) => {
                const meta = getMeta(category);
                const Icon = meta.icon;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      setExpandedCategories((prev) => { const next = new Set(prev); next.add(category); return next; });
                      if (categoryDocs.length > 0) handleDocSelect(categoryDocs[0]);
                    }}
                    className={`
                      group text-left p-5 rounded-xl border ${meta.border}
                      hover:shadow-md transition-all duration-200
                      bg-white hover:bg-gray-50
                    `}
                  >
                    <div className={`inline-flex p-2.5 rounded-lg ${meta.bg} mb-3`}>
                      <Icon className={`h-5 w-5 ${meta.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                      {category}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </h3>
                    <p className="text-sm text-gray-500">
                      {categoryDocs.length} {categoryDocs.length === 1 ? "article" : "articles"}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quick links */}
            {categories.length > 0 && (
              <div className="mt-12">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  All articles
                </h2>
                <div className="space-y-1">
                  {docs.map((doc: any) => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocSelect(doc)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1 truncate">
                        {doc.title}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {doc.category}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Article detail view ── */
          <div className="max-w-3xl mx-auto px-6 lg:px-12 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Docs
              </button>
              <span>/</span>
              <span className="text-gray-500">{selectedDoc.category}</span>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate">{selectedDoc.title}</span>
            </div>

            {/* Category badge */}
            {(() => {
              const meta = getMeta(selectedDoc.category || "Other");
              const Icon = meta.icon;
              return (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.bg} ${meta.color} mb-4`}>
                  <Icon className="h-3 w-3" />
                  {selectedDoc.category}
                </div>
              );
            })()}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedDoc.title}</h1>

            {/* Content */}
            {selectedDoc.content && (
              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                  {selectedDoc.content}
                </p>
              </div>
            )}

            {/* Items */}
            {selectedDoc.items &&
              Array.isArray(selectedDoc.items) &&
              selectedDoc.items.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-gray-400" />
                    Items
                    <span className="text-sm font-normal text-gray-400">
                      ({selectedDoc.items.length})
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {selectedDoc.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-500 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Keywords */}
            {selectedDoc.keywords &&
              Array.isArray(selectedDoc.keywords) &&
              selectedDoc.keywords.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Related topics
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.keywords.map((kw: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 hover:bg-gray-200 transition-colors cursor-default"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Navigation */}
            {(() => {
              const currentIdx = docs.findIndex((d: any) => d.id === selectedDocId);
              const prevDoc = currentIdx > 0 ? docs[currentIdx - 1] : null;
              const nextDoc = currentIdx < docs.length - 1 ? docs[currentIdx + 1] : null;

              return (
                <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
                  {prevDoc ? (
                    <button
                      onClick={() => handleDocSelect(prevDoc)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <div className="text-left">
                        <div className="text-xs text-gray-400">Previous</div>
                        <div className="font-medium">{prevDoc.title}</div>
                      </div>
                    </button>
                  ) : (
                    <div />
                  )}
                  {nextDoc ? (
                    <button
                      onClick={() => handleDocSelect(nextDoc)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors text-right"
                    >
                      <div>
                        <div className="text-xs text-gray-400">Next</div>
                        <div className="font-medium">{nextDoc.title}</div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
}
