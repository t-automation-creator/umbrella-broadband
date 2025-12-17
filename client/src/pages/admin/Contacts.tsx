import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminContacts() {
  return (
    <AdminLayout>
      <ContactsContent />
    </AdminLayout>
  );
}

function ContactsContent() {
  const { data: contacts, refetch } = trpc.contact.list.useQuery();
  const markReadMutation = trpc.contact.markRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success("Inquiry deleted");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete inquiry");
    },
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);
  type ContactType = NonNullable<typeof contacts>[number];
  const [viewContact, setViewContact] = useState<ContactType | null>(null);

  const handleView = (contact: ContactType) => {
    setViewContact(contact);
    if (!contact.read) {
      markReadMutation.mutate({ id: contact.id });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
        <p className="text-muted-foreground mt-1">View and manage contact form submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors ${
                    !contact.read ? "bg-blue-50/50 border-blue-200" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!contact.read && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      {contact.company && (
                        <Badge variant="outline" className="hidden sm:inline-flex">
                          {contact.company}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {contact.email}
                      {contact.phone && <span className="ml-2">• {contact.phone}</span>}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{contact.message}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleView(contact)}>
                      {contact.read ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No inquiries yet</h3>
              <p className="text-muted-foreground mt-1">Contact form submissions will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewContact !== null} onOpenChange={() => setViewContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Inquiry</DialogTitle>
          </DialogHeader>
          {viewContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{viewContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{viewContact.email}</p>
                </div>
                {viewContact.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{viewContact.phone}</p>
                  </div>
                )}
                {viewContact.company && (
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{viewContact.company}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap">{viewContact.message}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(viewContact.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <a href={`mailto:${viewContact.email}`}>
                  <Button>Reply via Email</Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
