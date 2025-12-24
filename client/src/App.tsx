import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

// Loading spinner component for Suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Lazy load public pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Sectors = lazy(() => import("./pages/Sectors"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Starlink = lazy(() => import("./pages/Starlink"));
const ManagedBroadband = lazy(() => import("./pages/ManagedBroadband"));
const VoIP = lazy(() => import("./pages/VoIP"));
const CCTV = lazy(() => import("./pages/CCTV"));
const AccessControl = lazy(() => import("./pages/AccessControl"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load admin pages (separate chunk)
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBlogList = lazy(() => import("./pages/admin/BlogList"));
const AdminBlogEdit = lazy(() => import("./pages/admin/BlogEdit"));
const AdminContacts = lazy(() => import("./pages/admin/Contacts"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminCaseStudiesList = lazy(() => import("./pages/admin/CaseStudiesList"));
const AdminCaseStudyEdit = lazy(() => import("./pages/admin/CaseStudyEdit"));
const AdminChatLeads = lazy(() => import("./pages/admin/ChatLeads"));
const AdminAuthGuard = lazy(() => import("./components/AdminAuthGuard"));

// Lazy load ChatBot (it's a large component with its own dependencies)
const ChatBot = lazy(() => import("./components/ChatBot"));

// Wrapper component for protected admin routes
function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminAuthGuard>
        <Component />
      </AdminAuthGuard>
    </Suspense>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/sectors" component={Sectors} />
        <Route path="/solutions" component={Solutions} />
        <Route path="/starlink" component={Starlink} />
        <Route path="/managed-broadband" component={ManagedBroadband} />
        <Route path="/voip" component={VoIP} />
        <Route path="/cctv" component={CCTV} />
        <Route path="/access-control" component={AccessControl} />
        <Route path="/contact" component={Contact} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/case-studies/:slug" component={CaseStudyDetail} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        
        {/* Admin login (public) */}
        <Route path="/admin/login" component={AdminLogin} />
        
        {/* Protected admin routes */}
        <Route path="/admin">
          {() => <ProtectedAdminRoute component={AdminDashboard} />}
        </Route>
        <Route path="/admin/blog">
          {() => <ProtectedAdminRoute component={AdminBlogList} />}
        </Route>
        <Route path="/admin/blog/new">
          {() => <ProtectedAdminRoute component={AdminBlogEdit} />}
        </Route>
        <Route path="/admin/blog/:id">
          {() => <ProtectedAdminRoute component={AdminBlogEdit} />}
        </Route>
        <Route path="/admin/contacts">
          {() => <ProtectedAdminRoute component={AdminContacts} />}
        </Route>
        <Route path="/admin/settings">
          {() => <ProtectedAdminRoute component={AdminSettings} />}
        </Route>
        <Route path="/admin/case-studies">
          {() => <ProtectedAdminRoute component={AdminCaseStudiesList} />}
        </Route>
        <Route path="/admin/case-studies/new">
          {() => <ProtectedAdminRoute component={AdminCaseStudyEdit} />}
        </Route>
        <Route path="/admin/case-studies/:id">
          {() => <ProtectedAdminRoute component={AdminCaseStudyEdit} />}
        </Route>
        <Route path="/admin/chat-leads">
          {() => <ProtectedAdminRoute component={AdminChatLeads} />}
        </Route>
        
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
          <Suspense fallback={null}>
            <ChatBot />
          </Suspense>
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
