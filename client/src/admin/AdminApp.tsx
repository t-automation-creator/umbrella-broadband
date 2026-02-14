import { useEffect } from "react";
import { Route, Switch } from "wouter";
import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminBlogList from "../pages/admin/BlogList";
import AdminBlogEdit from "../pages/admin/BlogEdit";
import AdminContacts from "../pages/admin/Contacts";
import AdminSettings from "../pages/admin/Settings";
import AdminCaseStudiesList from "../pages/admin/CaseStudiesList";
import AdminCaseStudyEdit from "../pages/admin/CaseStudyEdit";
import AdminChatLeads from "../pages/admin/ChatLeads";
import AdminAuthGuard from "../components/AdminAuthGuard";

function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminAuthGuard>
      <Component />
    </AdminAuthGuard>
  );
}

export default function AdminApp() {
  // Prevent search engines from indexing any admin pages
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");

    return () => {
      meta?.remove();
    };
  }, []);

  // Uses absolute paths (not relative) because the parent route does NOT use the "nest" prop.
  // This preserves compatibility with AdminLayout and AdminAuthGuard which use absolute paths.
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
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
    </Switch>
  );
}
