
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
- [ ] Add email notifications for contact form submissions
- [ ] Implement blog image upload functionality
- [x] Fix auto-login after logout issue (TRPC cache clearing)
- [x] Remove OAuth fallback from admin auth - password only
