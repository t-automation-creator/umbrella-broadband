import React, { lazy, Suspense } from "react";
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
import Services from "./pages/Services";
import Starlink from "./pages/Starlink";
import ManagedBroadband from "./pages/ManagedBroadband";
import VoIP from "./pages/VoIP";
import CCTV from "./pages/CCTV";
import AccessControl from "./pages/AccessControl";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CaseStudies from "./pages/CaseStudies";
import Support from "./pages/Support";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import ChatBot from "./components/ChatBot";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

// Lazy-load admin app so its route definitions are in a separate code-split chunk.
// This prevents the Manus platform sitemap scanner from finding admin paths
// in the main bundle and adding them to the sitemap.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/sectors" component={Sectors} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/services" component={Services} />
      <Route path="/starlink" component={Starlink} />
      <Route path="/managed-broadband" component={ManagedBroadband} />
      <Route path="/voip" component={VoIP} />
      <Route path="/cctv" component={CCTV} />
      <Route path="/access-control" component={AccessControl} />
      <Route path="/contact" component={Contact} />
      <Route path="/support" component={Support} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/case-studies/:slug" component={CaseStudyDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />

      {/* All redirect routes (support-redirect, legacy URLs, trailing-slash duplicates)
          have been moved to Express server-side 301 redirects in server/_core/index.ts.
          They must NOT be defined here as React routes because the Manus platform
          sitemap scanner picks up every path: "..." in the compiled bundle. */}

      {/* Admin — single wildcard route with lazy-loading to keep admin paths out of main bundle.
          Uses /*? (optional wildcard) to match /admin and all sub-paths.
          NOT using "nest" prop so that child routes can keep using absolute paths. */}
      <Route path="/admin/*?">
        {() => (
          <Suspense fallback={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            </div>
          }>
            <AdminApp />
          </Suspense>
        )}
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
          <ScrollToTop />
          <Router />
          <ChatBot />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
