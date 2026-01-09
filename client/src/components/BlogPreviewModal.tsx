import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { format } from "date-fns";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview Blog Post
          </DialogTitle>
        </DialogHeader>
        
        {/* Preview Content - Styled like the actual blog post page */}
        <div className="mt-6 space-y-6">
          {/* Hero Image */}
          {imageUrl && (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Header */}
          <div className="space-y-4">
            {category && (
              <div className="inline-block">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {category}
                </span>
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {author && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">By {author}</span>
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
            <div className="text-lg text-gray-700 italic border-l-4 border-primary pl-4">
              {excerpt}
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-800 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br />"),
              }}
            />
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
