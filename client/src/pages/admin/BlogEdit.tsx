import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Save, Sparkles, Loader2, Upload, Image as ImageIcon, Wand2, Eye } from "lucide-react";
import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useLocation, useParams } from "wouter";
import BlogPreviewModal from "@/components/BlogPreviewModal";

// Lazy load the rich text editor to reduce initial bundle size
const RichTextEditor = lazy(() => import("@/components/RichTextEditor"));
import SourcesEditor from "@/components/SourcesEditor";

export default function AdminBlogEdit() {
  return (
    <AdminLayout>
      <BlogEditContent />
    </AdminLayout>
  );
}

function BlogEditContent() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const isNew = !params.id || params.id === "new";
  const postId = isNew ? null : parseInt(params.id, 10);

  const { data: existingPost, isLoading } = trpc.blog.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(false);

  // AI Generation state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [sources, setSources] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [seoOptimizing, setSeoOptimizing] = useState(false);

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt || "");
      setContent(existingPost.content || "");
      setCategory(existingPost.category || "");
      setImageUrl(existingPost.imageUrl || "");
      setAuthor(existingPost.author || "");
      setPublished(existingPost.published);
      setSources(existingPost.sources || "");
    }
  }, [existingPost]);

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully");
      setLocation("/admin/blog");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Post updated successfully");
      setLocation("/admin/blog");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update post");
    },
  });

  const seoOptimizeMutation = trpc.ai.optimizeBlogPostForSEO.useMutation({
    onSuccess: (data) => {
      setTitle(data.title || title);
      setExcerpt(data.excerpt || excerpt);
      setContent(data.content || content);
      toast.success("Post optimized for SEO! Review the changes and adjust as needed.");
      setSeoOptimizing(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to optimize for SEO");
      setSeoOptimizing(false);
    },
  });

  const generateMutation = trpc.ai.generateBlogPost.useMutation({
    onSuccess: (data) => {
      // Populate form fields with AI-generated content
      if (data.title) setTitle(data.title);
      if (data.slug) setSlug(data.slug);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.content) setContent(data.content);
      if (data.category) setCategory(data.category);
      if (data.author) setAuthor(data.author);
      if (data.imagePrompt) setImagePrompt(data.imagePrompt);
      
      setAiDialogOpen(false);
      setRawText("");
      toast.success("Content generated! Review and edit as needed.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate content");
    },
  });

  const uploadMutation = trpc.upload.image.useMutation({
    onSuccess: (data) => {
      setImageUrl(data.url);
      toast.success("Image uploaded successfully!");
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload image");
      setIsUploading(false);
    },
  });

  const generateExcerptMutation = trpc.chat.generateExcerpt.useMutation({
    onSuccess: (data: { excerpt: string }) => {
      if (data.excerpt) {
        setExcerpt(data.excerpt);
        toast.success("Excerpt generated!");
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || "Failed to generate excerpt");
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset file input to allow re-selecting the same file
    e.target.value = "";

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    // Validate image dimensions (min 1600x900 for retina)
    const img = new Image();
    img.onload = () => {
      if (img.width < 800 || img.height < 450) {
        toast.error(`Image too small (${img.width}x${img.height}). Minimum 800x450 pixels for sharp display.`);
        setIsUploading(false);
        return;
      }
      
      // Convert to base64 and upload
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        uploadMutation.mutate({
          filename: file.name,
          data: base64,
          contentType: file.type,
        });
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    };
    img.onerror = () => {
      toast.error("Failed to load image");
      setIsUploading(false);
    };
    img.src = URL.createObjectURL(file);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew || !existingPost?.slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleGenerate = () => {
    if (rawText.trim().length < 10) {
      toast.error("Please enter at least 10 characters of content");
      return;
    }
    generateMutation.mutate({ rawText: rawText.trim() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    if (isNew) {
      createMutation.mutate({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim() || undefined,
        category: category.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        author: author.trim() || undefined,
        sources: sources.trim() || undefined,
        published,
      });
    } else {
      updateMutation.mutate({
        id: postId!,
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim() || null,
        category: category.trim() || null,
        imageUrl: imageUrl.trim() || null,
        author: author.trim() || null,
        sources: sources.trim() || null,
        published,
      });
    }
  };

  if (!isNew && isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "New Post" : "Edit Post"}
            </h1>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* SEO Optimization Button */}
          <Button 
            type="button"
            variant="outline" 
            className="gap-2"
            onClick={() => {
              if (!title.trim() || !excerpt.trim() || !content.trim()) {
                toast.error("Please fill in title, excerpt, and content before optimizing for SEO");
                return;
              }
              setSeoOptimizing(true);
              seoOptimizeMutation.mutate({
                title: title.trim(),
                excerpt: excerpt.trim(),
                content: content.trim(),
                category: category.trim() || undefined,
              });
            }}
            disabled={seoOptimizeMutation.isPending}
          >
            {seoOptimizeMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Manus Optimise for SEO
              </>
            )}
          </Button>

          {/* Preview Button */}
          <Button 
            type="button"
            variant="outline" 
            className="gap-2"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          {/* Create with Manus Button */}
          <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Create with Manus
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Create with Manus AI
              </DialogTitle>
              <DialogDescription>
                Paste your raw text, notes, or ideas below. Manus will generate a complete blog post that you can review and edit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your content here... For example:

- Key points about managed Wi-Fi for landlords
- Benefits include reduced maintenance, tenant satisfaction
- Umbrella Broadband offers 24/7 support
- Case study: 50-unit HMO in Manchester saw 30% fewer complaints"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Tip: Include key facts, statistics, and main points. The AI will structure them into a professional blog post.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={generateMutation.isPending || rawText.trim().length < 10}
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Post
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title * (Use Shift+Enter for line breaks)</Label>
                <Textarea
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title. Use Shift+Enter to add line breaks for better formatting."
                  required
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Industry News"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg or upload below"
                  className="flex-1"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      {isUploading ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</>
                      ) : (
                        <><Upload className="h-4 w-4 mr-2" />Upload</>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
              {imageUrl && (
                <div className="mt-2 relative rounded-lg overflow-hidden border bg-muted">
                  <img loading="lazy" src={imageUrl}
                    alt="Featured image preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImageUrl("")}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>

            {/* AI Generated Image Prompt */}
            {imagePrompt && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-dashed">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Image Prompt (for Nano Banana)
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(imagePrompt);
                      toast.success("Image prompt copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                  {imagePrompt}
                </p>
                <p className="text-xs text-muted-foreground">
                  Use this prompt with Nano Banana in Manus to generate a featured image, then paste the URL above.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!content || content.length < 50) {
                      toast.error("Add more content first (at least 50 characters)");
                      return;
                    }
                    generateExcerptMutation.mutate({ content, title });
                  }}
                  disabled={generateExcerptMutation.isPending || !content || content.length < 50}
                  className="gap-1"
                >
                  {generateExcerptMutation.isPending ? (
                    <><Loader2 className="h-3 w-3 animate-spin" />Generating...</>
                  ) : (
                    <><Wand2 className="h-3 w-3" />Regenerate</>
                  )}
                </Button>
              </div>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post (or click Regenerate to auto-generate from content)"
                rows={2}
              />
            </div>

<div className="space-y-2">
              <Label>Content</Label>
              <Suspense fallback={
                <div className="border rounded-lg p-8 bg-muted/30 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              }>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your blog post content..."
                />
              </Suspense>
            </div>

            <SourcesEditor
              value={sources}
              onChange={setSources}
              content={content}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/blog">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : "Save Post"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Blog Preview Modal */}
      <BlogPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={title}
        excerpt={excerpt}
        content={content}
        imageUrl={imageUrl}
        category={category}
        author={author}
        publishedDate={new Date()}
      />
    </div>
  );
}
