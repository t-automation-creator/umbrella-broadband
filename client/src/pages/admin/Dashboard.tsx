import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { FileText, Mail, Home } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}

function DashboardContent() {
  const { data: blogPosts } = trpc.blog.adminList.useQuery();
  const { data: contacts } = trpc.contact.list.useQuery();

  const unreadContacts = contacts?.filter((c) => !c.read).length ?? 0;
  const publishedPosts = blogPosts?.filter((p) => p.published).length ?? 0;
  const draftPosts = blogPosts?.filter((p) => !p.published).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your Umbrella Broadband admin panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts}</div>
            <p className="text-xs text-muted-foreground">Live on the website</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftPosts}</div>
            <p className="text-xs text-muted-foreground">Awaiting publication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Inquiries</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadContacts}</div>
            <p className="text-xs text-muted-foreground">New contact submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/blog/new">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Create New Blog Post
              </Button>
            </Link>
            <Link href="/admin/contacts">
              <Button className="w-full justify-start" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                View Contact Inquiries
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full justify-start" variant="outline">
                <Home className="mr-2 h-4 w-4" />
                View Live Website
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {contacts && contacts.length > 0 ? (
              <div className="space-y-3">
                {contacts.slice(0, 5).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {!contact.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      <span className="font-medium">{contact.name}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No inquiries yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
