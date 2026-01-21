# Link Accessibility Guidelines

This document outlines best practices for writing descriptive link text to improve SEO and accessibility.

## Why Descriptive Link Text Matters

- **SEO**: Search engines use link text to understand page content
- **Accessibility**: Screen reader users rely on link text to understand where links go
- **User Experience**: Descriptive links help all users understand the purpose of clicking

## Guidelines

### ❌ AVOID - Non-Descriptive Link Text

```tsx
// Bad - Generic text
<Link href="/page">Read More</Link>
<Link href="/page">Learn more</Link>
<Link href="/page">Click here</Link>
<Link href="/page">More info</Link>
```

### ✅ DO - Descriptive Link Text

```tsx
// Good - Specific to the content
<Link href={`/blog/${post.slug}`}>
  Read {post.title} article
</Link>

<Link href={`/case-studies/${study.slug}`}>
  View {study.title} case study
</Link>

<Link href="/managed-broadband">
  Explore Connectivity Solutions
</Link>

<Link href="/privacy-policy">
  Learn more about our privacy policy
</Link>
```

## Best Practices

1. **Include the destination or topic** in the link text
2. **Use action verbs** when appropriate: "View", "Read", "Explore", "Discover"
3. **Make links self-contained** - they should make sense even when read out of context
4. **Avoid generic phrases** - "Read More", "Learn more", "Click here"
5. **For dynamic content** - include the specific title or name in the link text

## Examples by Component

### Blog Links
```tsx
<Link href={`/blog/${getPostSlug(post)}`}>
  Read {post.title} article
</Link>
```

### Case Study Links
```tsx
<Link href={`/case-studies/${study.slug}`}>
  View {study.title} case study
</Link>
```

### Feature/Service Links
```tsx
<Link href="/managed-broadband">
  Explore Connectivity Solutions
</Link>
```

### Policy/Legal Links
```tsx
<Link href="/privacy-policy">
  Learn more about our privacy policy
</Link>
```

## Testing

To verify link text is descriptive:
1. Read each link text in isolation
2. Ask: "Does this clearly indicate where the link goes?"
3. Check Google Search Console for "Links do not have descriptive text" warnings

## Tools

- [Google Search Console](https://search.google.com/search-console) - Reports non-descriptive links
- [WAVE Browser Extension](https://wave.webaim.org/extension/) - Accessibility checker
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Accessibility audits
