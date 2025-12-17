import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    const data = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content.trim() || undefined,
      category: category.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      author: author.trim() || undefined,
      published,
    };

    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: postId!, ...data });
    }
  };

  if (!isNew && isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
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

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  required
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
              <Label htmlFor="imageUrl">Featured Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full post content (supports Markdown)"
                rows={12}
                className="font-mono text-sm"
              />
            </div>

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
    </div>
  );
}
