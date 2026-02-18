import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [formData, setFormData] = useState({ username: "", password: "", name: "", email: "" });

  const { data: admins, isLoading, refetch } = trpc.admin.management.list.useQuery();
  const createMutation = trpc.admin.management.create.useMutation();
  const updateMutation = trpc.admin.management.update.useMutation();
  const deleteMutation = trpc.admin.management.delete.useMutation();

  const handleCreate = async () => {
    if (!formData.username || !formData.password) {
      toast.error("Username and password are required");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success("Admin account created successfully");
      setFormData({ username: "", password: "", name: "", email: "" });
      setIsCreateOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin account");
    }
  };

  const handleUpdate = async () => {
    if (!selectedAdmin) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedAdmin.id,
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
      });
      toast.success("Admin account updated successfully");
      setIsEditOpen(false);
      setFormData({ username: "", password: "", name: "", email: "" });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update admin account");
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;

    try {
      await deleteMutation.mutateAsync({ id: selectedAdmin.id });
      toast.success("Admin account deleted successfully");
      setIsDeleteOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete admin account");
    }
  };

  const openEditDialog = (admin: any) => {
    setSelectedAdmin(admin);
    setFormData({ username: admin.username, password: "", name: admin.name || "", email: admin.email || "" });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (admin: any) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading admin accounts...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Accounts</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Password (min 8 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Name (optional)</label>
                <Input
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email (optional)</label>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {admins?.map((admin) => (
          <Card key={admin.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{admin.name || admin.username}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(admin)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog(admin)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Username:</strong> {admin.username}</p>
                {admin.email && <p><strong>Email:</strong> {admin.email}</p>}
                <p><strong>Created:</strong> {new Date(admin.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Username (read-only)</label>
              <Input value={formData.username} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Password (leave blank to keep current)</label>
              <Input
                type="password"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdate} className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Admin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the admin account for <strong>{selectedAdmin?.username}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
