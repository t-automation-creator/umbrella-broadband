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
import AdminAuthGuard from "./components/AdminAuthGuard";

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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
