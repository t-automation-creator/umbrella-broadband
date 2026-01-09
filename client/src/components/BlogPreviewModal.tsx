import { Button } from "@/components/ui/button";
import { Eye, X, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface BlogPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category?: string;
  author?: string;
  publishedDate?: Date;
}

export default function BlogPreviewModal({
  open,
  onOpenChange,
  title,
  excerpt,
  content,
  imageUrl,
  category,
  author,
  publishedDate,
}: BlogPreviewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!open) return null;

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Preview Blog Post</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Hero Image */}
          {imageUrl && !imageError && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-200 mb-8 shadow-md">
              <img
                src={imageUrl}
                alt={title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading image...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Error Placeholder */}
          {imageError && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 mb-8 shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Image failed to load</p>
                <p className="text-xs text-gray-400 mt-1">Check the image URL in the editor</p>
              </div>
            </div>
          )}

          {/* Post Header */}
          <div className="space-y-6 mb-8">
            {category && (
              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {category}
                </span>
              </div>
            )}
            
            <h1 className="text-5xl font-bold text-gray-900 leading-tight whitespace-pre-line">
              {title || "Untitled Post"}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-base text-gray-600 border-b border-gray-200 pb-6">
              {author && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">By {author}</span>
                </div>
              )}
              {publishedDate && (
                <div className="flex items-center gap-2">
                  <span>{format(publishedDate, "MMMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Excerpt */}
          {excerpt && (
            <div className="text-xl text-gray-700 italic border-l-4 border-blue-500 pl-6 mb-8 py-4 bg-blue-50 rounded-r">
              {excerpt}
            </div>
          )}

          {/* Main Content */}
          <div className="text-gray-800 leading-relaxed space-y-6 text-lg">
            {content ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            ) : (
              <p className="text-gray-400 italic">No content yet. Start writing to see preview.</p>
            )}
          </div>

          {/* Footer Spacing */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              This is a preview of how your blog post will appear on the website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
