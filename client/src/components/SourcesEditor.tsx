import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ExternalLink, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface Source {
  title: string;
  url: string;
}

interface SourcesEditorProps {
  value: string; // JSON string
  onChange: (json: string) => void;
  content?: string; // HTML content to extract links from
}

export default function SourcesEditor({ value, onChange, content }: SourcesEditorProps) {
  const [sources, setSources] = useState<Source[]>([]);

  // Parse initial value
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setSources(parsed);
        }
      } catch (e) {
        // Invalid JSON, start with empty array
        setSources([]);
      }
    } else {
      setSources([]);
    }
  }, [value]);

  // Update parent when sources change
  const updateSources = (newSources: Source[]) => {
    setSources(newSources);
    if (newSources.length === 0) {
      onChange('');
    } else {
      onChange(JSON.stringify(newSources));
    }
  };

  const addSource = () => {
    updateSources([...sources, { title: '', url: '' }]);
  };

  const removeSource = (index: number) => {
    updateSources(sources.filter((_, i) => i !== index));
  };

  const updateSource = (index: number, field: 'title' | 'url', value: string) => {
    const newSources = [...sources];
    newSources[index] = { ...newSources[index], [field]: value };
    updateSources(newSources);
  };

  // Extract links from HTML content
  const extractLinksFromContent = () => {
    if (!content) {
      toast.error('No content to extract links from');
      return;
    }

    // Parse HTML and extract anchor tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const links = doc.querySelectorAll('a[href]');

    if (links.length === 0) {
      toast.info('No links found in the content');
      return;
    }

    const extractedSources: Source[] = [];
    const existingUrls = new Set(sources.map(s => s.url.toLowerCase()));

    links.forEach((link) => {
      const url = link.getAttribute('href') || '';
      const linkText = link.textContent?.trim() || '';
      
      // Skip empty URLs, anchors, and internal links
      if (!url || url.startsWith('#') || url.startsWith('/') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        return;
      }

      // Skip if URL already exists in sources
      if (existingUrls.has(url.toLowerCase())) {
        return;
      }

      existingUrls.add(url.toLowerCase());
      
      // Use link text as title (the clickable text in the content)
      // This is the label that describes what the link is about
      extractedSources.push({ title: linkText, url });
    });

    if (extractedSources.length === 0) {
      toast.info('No new external links found to add');
      return;
    }

    // Merge with existing sources
    const newSources = [...sources, ...extractedSources];
    updateSources(newSources);
    toast.success(`Added ${extractedSources.length} source${extractedSources.length > 1 ? 's' : ''} from content`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label>Sources & References</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={extractLinksFromContent}
            className="gap-1"
            title="Extract links from content"
          >
            <Wand2 className="h-4 w-4" />
            Auto-Extract
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSource}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Source
          </Button>
        </div>
      </div>

      {sources.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg bg-muted/30">
          No sources added. Click "Auto-Extract" to find links in your content, or "Add Source" to add manually.
        </p>
      ) : (
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div
              key={index}
              className="flex gap-2 items-start p-3 border rounded-lg bg-muted/20"
            >
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Label (display text)
                    </Label>
                    <Input
                      value={source.title}
                      onChange={(e) => updateSource(index, 'title', e.target.value)}
                      placeholder="e.g., Ofcom Broadband Report 2024"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The text shown to readers for this source
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      URL
                    </Label>
                    <div className="flex gap-1 mt-1">
                      <Input
                        type="url"
                        value={source.url}
                        onChange={(e) => updateSource(index, 'url', e.target.value)}
                        placeholder="https://example.com/article"
                        className="flex-1"
                      />
                      {source.url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          asChild
                          className="shrink-0"
                        >
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSource(index)}
                className="text-destructive hover:text-destructive shrink-0"
                title="Remove source"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {sources.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Sources will appear at the bottom of the blog post. The label is the clickable text readers will see.
        </p>
      )}
    </div>
  );
}
