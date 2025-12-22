import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Sectors from "./pages/Sectors";
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBlogList from "./pages/admin/BlogList";
import AdminBlogEdit from "./pages/admin/BlogEdit";
import AdminContacts from "./pages/admin/Contacts";
import AdminSettings from "./pages/admin/Settings";
import AdminCaseStudiesList from "./pages/admin/CaseStudiesList";
import AdminCaseStudyEdit from "./pages/admin/CaseStudyEdit";
import AdminChatLeads from "./pages/admin/ChatLeads";
import AdminAuthGuard from "./components/AdminAuthGuard";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import ChatBot from "./components/ChatBot";

// Wrapper component for protected admin routes
function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminAuthGuard>
      <Component />
    </AdminAuthGuard>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/sectors" component={Sectors} />
      <Route path="/solutions" component={Solutions} />
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
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <ChatBot />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
