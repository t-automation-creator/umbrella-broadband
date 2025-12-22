
## CMS / Admin Dashboard
- [x] Upgrade to full-stack with database and authentication
- [x] Create blog posts database table
- [x] Create contact submissions database table
- [x] Build Admin Dashboard overview page
- [x] Build Admin Blog List page with CRUD operations
- [x] Build Admin Blog Edit/Create page
- [x] Build Admin Contacts page with read/delete functionality
- [x] Connect public Blog page to database
- [x] Connect Contact form to save submissions to database

## Individual Blog Post Pages
- [x] Create BlogPost page component with full content display
- [x] Add /blog/:slug route to App.tsx
- [x] Update Blog page "Read More" links to navigate to individual posts

## Admin Password Login
- [x] Create admin login page with username/password form
- [x] Add server-side authentication endpoint for admin login
- [x] Protect admin routes with session-based authentication
- [x] Store admin credentials securely as environment variables

## Admin Panel Enhancements
- [x] Add logout button to admin dashboard header
- [x] Implement rate limiting for login attempts
- [x] Add password change feature in admin settings

## Logout Button Visibility Fix
- [ ] Add prominent logout button visible in admin header/sidebar

## Logout Button Visibility
- [x] Add prominent logout button to admin sidebar/header

## New Features
- [x] Fix admin login redirect - login succeeds but doesn't navigate to dashboard
- [x] Persist admin sessions to database for production deployments
- [x] Fix admin pages to use password login instead of OAuth
- [x] Add email notifications for contact form submissions
- [ ] Implement blog image upload functionality
- [x] Fix auto-login after logout issue (TRPC cache clearing)
- [x] Remove OAuth fallback from admin auth - password only
- [x] Fix white space at top of admin login page

## Case Studies Feature
- [x] Add case studies database schema
- [x] Add case studies API routes (CRUD)
- [x] Create admin Case Studies list page
- [x] Create admin Case Studies edit page
- [x] Create public Case Studies listing page
- [x] Create public Case Study detail page
- [x] Add Case Studies to navigation menu (before Blog)
- [x] Reorganize admin sidebar with Content section

## Create with Manus AI Feature
- [x] Create AI generation API endpoint using Forge API
- [x] Add "Create with Manus" button to Blog Edit page
- [x] Add "Create with Manus" button to Case Study Edit page
- [x] Add modal/dialog for pasting raw text
- [x] Auto-populate form fields from AI response
- [x] Add AI image prompt generation for Nano Banana

## Image Upload Feature
- [x] Update AI prompts to specify web-optimized, mobile-responsive images (1600x900, 16:9)
- [x] Add image upload API endpoint using S3 storage
- [x] Add image upload UI to Blog Edit page
- [x] Add image upload UI to Case Study Edit page
- [x] Enhance AI image prompts with tech visuals and client name
- [x] Add Umbrella Broadband logo to AI image prompts for brand consistency

## Image Quality Optimization (Dec 2025)
- [x] Update minimum image size from 1600x900 to 800x450 (hero images removed)
- [x] Update AI prompts to generate 800x450 images
- [x] Change card grid to 2 columns for larger display (already done)
- [x] Fix card image height - images displaying too large after grid change (h-72 → h-48)
- [x] Fix image cropping - use aspect-ratio instead of fixed height to show full image

## Hybrid AI Chatbot with Lead Capture
- [x] Add chat_leads database table for storing captured leads
- [x] Create chat API route with AI responses using Forge API
- [x] Build floating chatbot UI component
- [x] Train AI on Umbrella Broadband services (broadband, VoIP, security, management)
- [x] Implement lead capture form triggered by buying intent
- [x] Add chat leads view in admin panel
- [x] Test chatbot responses and lead capture flow

## Chatbot Enhancements
- [x] Add property type dropdown to lead capture form (HMO, student accommodation, commercial)
- [x] Make chatbot proactive - auto-open after 10 seconds on page
- [x] Customize chatbot welcome messages based on current page
- [x] Set up email notifications for new chat leads
- [x] Add email notifications for contact form submissions
- [x] Update chatbot welcome messages to remove 'connectivity' focus (made shorter)
