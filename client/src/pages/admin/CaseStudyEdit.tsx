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
import { ArrowLeft, Save, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";

export default function AdminCaseStudyEdit() {
  return (
    <AdminLayout>
      <CaseStudyEditContent />
    </AdminLayout>
  );
}

function CaseStudyEditContent() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const isNew = !params.id || params.id === "new";
  const caseStudyId = isNew ? null : parseInt(params.id, 10);

  const { data: existingCaseStudy, isLoading } = trpc.caseStudies.getById.useQuery(
    { id: caseStudyId! },
    { enabled: !!caseStudyId }
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [testimonialAuthor, setTestimonialAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);

  // AI Generation state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");

  useEffect(() => {
    if (existingCaseStudy) {
      setTitle(existingCaseStudy.title);
      setSlug(existingCaseStudy.slug);
      setClientName(existingCaseStudy.clientName);
      setIndustry(existingCaseStudy.industry || "");
      setChallenge(existingCaseStudy.challenge || "");
      setSolution(existingCaseStudy.solution || "");
      setResults(existingCaseStudy.results || "");
      setTestimonial(existingCaseStudy.testimonial || "");
      setTestimonialAuthor(existingCaseStudy.testimonialAuthor || "");
      setImageUrl(existingCaseStudy.imageUrl || "");
      setPublished(existingCaseStudy.published);
    }
  }, [existingCaseStudy]);

  const createMutation = trpc.caseStudies.create.useMutation({
    onSuccess: () => {
      toast.success("Case study created successfully");
      setLocation("/admin/case-studies");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create case study");
    },
  });

  const updateMutation = trpc.caseStudies.update.useMutation({
    onSuccess: () => {
      toast.success("Case study updated successfully");
      setLocation("/admin/case-studies");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update case study");
    },
  });

  const generateMutation = trpc.ai.generateCaseStudy.useMutation({
    onSuccess: (data) => {
      // Populate form fields with AI-generated content
      if (data.title) setTitle(data.title);
      if (data.slug) setSlug(data.slug);
      if (data.clientName) setClientName(data.clientName);
      if (data.industry) setIndustry(data.industry);
      if (data.challenge) setChallenge(data.challenge);
      if (data.solution) setSolution(data.solution);
      if (data.results) setResults(data.results);
      if (data.testimonial) setTestimonial(data.testimonial);
      if (data.testimonialAuthor) setTestimonialAuthor(data.testimonialAuthor);
      if (data.imagePrompt) setImagePrompt(data.imagePrompt);
      
      setAiDialogOpen(false);
      setRawText("");
      toast.success("Content generated! Review and edit as needed.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate content");
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
    if (isNew || !existingCaseStudy?.slug) {
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

    if (!title.trim() || !slug.trim() || !clientName.trim()) {
      toast.error("Title, slug, and client name are required");
      return;
    }

    const data = {
      title: title.trim(),
      slug: slug.trim(),
      clientName: clientName.trim(),
      industry: industry.trim() || undefined,
      challenge: challenge.trim() || undefined,
      solution: solution.trim() || undefined,
      results: results.trim() || undefined,
      testimonial: testimonial.trim() || undefined,
      testimonialAuthor: testimonialAuthor.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      published,
    };

    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: caseStudyId!, ...data });
    }
  };

  if (!isNew && isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/case-studies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "New Case Study" : "Edit Case Study"}
            </h1>
          </div>
        </div>
        
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
                Paste your raw text, notes, or project details below. Manus will generate a complete case study that you can review and edit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your content here... For example:

Client: Manchester Student Housing Ltd
Industry: Student Accommodation
- 200-bed student accommodation in Manchester
- Old copper wiring, constant complaints about slow WiFi
- Installed full fibre infrastructure
- Managed WiFi with 24/7 support
- Results: 99.9% uptime, tenant satisfaction up 40%
- Quote from property manager about the improvement"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Tip: Include client name, industry, the problem, your solution, and any results/metrics. The AI will structure them into a professional case study.
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
                    Generate Case Study
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Case Study Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter case study title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="case-study-url-slug"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., ABC Corporation"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Sector</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Healthcare, Education"
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
              <Label htmlFor="challenge">The Challenge</Label>
              <Textarea
                id="challenge"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Describe the problem or challenge the client faced"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Our Solution</Label>
              <Textarea
                id="solution"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Describe how Umbrella Broadband solved the problem"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Results & Outcomes</Label>
              <Textarea
                id="results"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="Describe the results achieved (e.g., 50% faster speeds, 99.9% uptime)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial">Client Testimonial</Label>
              <Textarea
                id="testimonial"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="Quote from the client about their experience"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonialAuthor">Testimonial Author</Label>
              <Input
                id="testimonialAuthor"
                value={testimonialAuthor}
                onChange={(e) => setTestimonialAuthor(e.target.value)}
                placeholder="e.g., John Smith, IT Director"
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
              <Link href="/admin/case-studies">
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
                  : "Save Case Study"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
