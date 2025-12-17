import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
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

export default function AdminCaseStudiesList() {
  return (
    <AdminLayout>
      <CaseStudiesListContent />
    </AdminLayout>
  );
}

function CaseStudiesListContent() {
  const { data: caseStudies, refetch } = trpc.caseStudies.adminList.useQuery();
  const deleteMutation = trpc.caseStudies.delete.useMutation({
    onSuccess: () => {
      toast.success("Case study deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete case study");
    },
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground mt-1">Manage your client success stories</p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Case Study
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Case Studies</CardTitle>
        </CardHeader>
        <CardContent>
          {caseStudies && caseStudies.length > 0 ? (
            <div className="space-y-4">
              {caseStudies.map((study) => (
                <div
                  key={study.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{study.title}</h3>
                      <Badge variant={study.published ? "default" : "secondary"}>
                        {study.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">{study.clientName}</span>
                      {study.industry && <span className="ml-2">• {study.industry}</span>}
                      <span className="ml-2">• {new Date(study.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/case-studies/${study.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(study.id)}
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
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No case studies yet</h3>
              <p className="text-muted-foreground mt-1">Create your first case study to showcase client success.</p>
              <Link href="/admin/case-studies/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Case Study
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Case Study</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this case study? This action cannot be undone.
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
