
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
- [x] Adjust chatbot messages to medium length - asks 'What are you looking for?'
- [x] Add quick reply buttons to chatbot (Get a quote, Schedule a callback, Learn about pricing, Speak to someone)
- [x] Add callback scheduling form in chatbot
- [x] Create new hero image for homepage
- [x] Create realistic hero image showing property types and solutions, make larger
- [x] Create aerial view hero image with labelled property types
- [x] Make aerial image full background of hero section
- [x] Regenerate aerial hero image with labels positioned further right
- [x] Reduce gradient overlay width on hero section
- [x] Regenerate hero image with standardized icons (WiFi, VoIP, CCTV) centered above labels
- [x] Student/Commercial/HMO get all 3 icons, Residential gets WiFi and CCTV only
- [x] Blend gradient better at bottom of hero
- [x] Regenerate hero as one continuous image (no split/different left side)
- [x] Make gradient almost invisible/very subtle
- [x] Use smaller icon and label sizes like previous version
- [x] Fix CCTV icon in hero image (should be camera icon like previous version)
- [x] Add subtle text shadow to hero heading for better readability
- [x] Reverted to hero-aerial-v4.png (preferred version without circle lines)
- [x] Change CCTV icon back to original camera style (keep everything else the same)
- [x] Increase text shadow strength for better readability
- [x] Fix hero mobile display - adjust background position to show town, not labels
- [x] Increase gradient overlay on mobile for better text readability
- [x] Fix hero heading - keep 'Security Solutions' on same line
- [x] Adjust heading - 'Broadband, VoIP &' on one line, 'Security Solutions' on next
- [x] Fix hero image - move Student Accommodation icons lower to avoid nav bar overlap
- [x] Revert to hero-aerial-v6.png and adjust background position to move icons down
- [x] Reset hero background position back to normal (remove offset)
- [x] Increase navigation bar top and bottom padding (72px → 88px)
- [x] Adjust hero background position on large screens to clear nav bar overlap
- [x] Regenerate hero image with Student Accommodation positioned lower to avoid nav bar overlap
- [x] Create mobile-optimized hero image with better positioning for portrait screens
- [x] Update Hero component to serve different images for mobile vs desktop
- [x] Regenerate mobile hero image with property labels at top (in sky area)
- [x] Move hero text and buttons to bottom of section on mobile
- [x] Regenerate mobile hero image with all content (labels, buildings, icons, lines) fitting in top 60% above text overlay
- [x] Regenerate mobile hero image to match desktop style (no boxes around labels, less sky headroom)
- [x] Configure dual SMTP - sales (enquiries@student-internet.co.uk) and support (support@umbrella-broadband.co.uk)
- [x] Update server email service to support both sales and support email routing
- [x] Update chatbot to handle FAQ, sales enquiries, callbacks, and support enquiries
- [x] Test email sending for both sales and support flows
- [x] Test email flows - verify sales and support emails arrive correctly
- [x] Update AI chatbot system prompt to detect support issues and route to support form
- [x] Add customer confirmation auto-reply emails for enquiries and support tickets
- [x] Troubleshoot SMTP email delivery - replaced with Resend
- [x] Fix homepage SEO - add meta keywords
- [x] Fix homepage SEO - shorten title to 30-60 characters
- [x] Add SEO optimization to About Us page (title + keywords)
- [x] Add SEO optimization to Solutions page (title + keywords)
- [x] Add SEO optimization to Sectors page (title + keywords)
- [x] Change hero image padding-top from 128 to 228
- [x] Set up Resend email integration as alternative to SMTP
- [x] Configure Resend to send notifications to enquiries@student-internet.co.uk (sales) and support@umbrella-broadband.co.uk (support)

## Managed Starlink Services Page
- [x] Create new Managed Starlink Services dedicated webpage
- [x] Add navigation link to Starlink page
- [x] Add SEO optimization for Starlink page
- [x] Move Starlink under Solutions as dropdown menu item 'Managed Starlink'
- [x] Update Navbar with Solutions dropdown containing main Solutions page and Managed Starlink
- [ ] Fix mobile menu - ensure Starlink appears under Solutions dropdown on mobile
- [x] Fix unnatural spacing between Solutions and dropdown items in mobile menu
- [x] Remove gap between Solutions and dropdown items - normalize like other menu items
- [x] Fix uniform spacing in mobile menu - remove extra gap between Solutions dropdown and Case Studies
- [x] Change chatbot popup delay to 20 seconds

## Individual Solution Pages
- [x] Create Managed Broadband page with detailed content
- [x] Create VoIP Phone Systems page with detailed content
- [x] Create CCTV & Security page with detailed content
- [x] Create Access Control & Intercom Systems page with detailed content
- [x] Update Solutions dropdown menu with all solution pages
- [x] Link homepage service sections to their respective solution pages

## Solution Page Hero Images
- [x] Generate Managed Broadband hero image (desktop + mobile)
- [x] Generate VoIP Phone Systems hero image (desktop + mobile)
- [x] Generate CCTV & Security hero image (desktop + mobile)
- [x] Generate Access Control & Intercom hero image (desktop + mobile)
- [x] Update solution pages with new hero images (responsive)

## Additional Hero Images
- [x] Generate Starlink hero image (desktop + mobile)
- [x] Generate Sectors hero image (desktop + mobile)
- [x] Update Starlink page with hero images
- [x] Update Sectors page with hero images

## Testimonials Carousel
- [x] Create TestimonialsCarousel component
- [x] Add testimonials data with customer quotes and company names
- [x] Integrate carousel on homepage

## Animated Statistics Counters
- [x] Create AnimatedCounter component with scroll-triggered animation
- [x] Add statistics section to homepage (properties connected, uptime, support response)
- [x] Style and position statistics section appropriately

## Hero Text Alignment Fix
- [x] Align hero text to left on all solution pages (Managed Broadband, VoIP, CCTV, Access Control, Starlink, Sectors)

## Access Control Rename
- [x] Rename "Access Control & Intercom Systems" to "Access Control Solutions" across all pages

## Homepage Layout Update
- [x] Move "Trusted Across the UK" statistics section below Comprehensive Connectivity boxes

## Social Media Icons
- [x] Add LinkedIn icon and link to footer
- [x] Add X (Twitter) icon and placeholder link to footer
- [x] Add social icons to other relevant areas (header/contact page if needed)

## Navigation Fix
- [x] Fix internal links to scroll to top of page when clicked

## Cookie Consent & Navbar Social Icons
- [x] Create cookie consent banner component for GDPR compliance
- [x] Add social icons (LinkedIn, X) to navbar right of Contact button
