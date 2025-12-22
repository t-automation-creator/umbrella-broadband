import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Phone, Mail, Building2, Calendar, Trash2, ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminChatLeads() {
  return (
    <AdminLayout>
      <ChatLeadsContent />
    </AdminLayout>
  );
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
};

function ChatLeadsContent() {
  const { data: leads, isLoading, refetch } = trpc.chat.getLeads.useQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState("");

  const updateMutation = trpc.chat.updateLead.useMutation({
    onSuccess: () => {
      toast.success("Lead updated");
      refetch();
      setEditingNotes(null);
    },
    onError: () => {
      toast.error("Failed to update lead");
    },
  });

  const deleteMutation = trpc.chat.deleteLead.useMutation({
    onSuccess: () => {
      toast.success("Lead deleted");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete lead");
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, status: status as any });
  };

  const handleSaveNotes = (id: number) => {
    updateMutation.mutate({ id, notes: notesValue });
  };

  const newLeadsCount = leads?.filter((l) => l.status === "new").length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Chat Leads
          </h1>
          <p className="text-muted-foreground mt-1">
            Leads captured from the AI chatbot conversations
          </p>
        </div>
        {newLeadsCount > 0 && (
          <Badge className="bg-blue-500 text-white text-sm px-3 py-1">
            {newLeadsCount} New Lead{newLeadsCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {!leads || leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              When visitors interact with the chatbot and show buying intent, their contact details will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id} className={lead.status === "new" ? "border-blue-300 bg-blue-50/30" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {lead.name || "Anonymous"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleStatusChange(lead.id, value)}
                    >
                      <SelectTrigger className={`w-32 h-8 text-xs ${statusColors[lead.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this lead? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate({ id: lead.id })}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {lead.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                        {lead.email}
                      </a>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  {lead.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.company}</span>
                    </div>
                  )}
                  {lead.serviceInterest && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="capitalize">
                        {lead.serviceInterest}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Expandable section */}
                <div className="border-t pt-3">
                  <button
                    onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedId === lead.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {expandedId === lead.id ? "Hide details" : "Show conversation & notes"}
                  </button>

                  {expandedId === lead.id && (
                    <div className="mt-4 space-y-4">
                      {/* Conversation Summary */}
                      {lead.conversationSummary && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Conversation Summary</h4>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {lead.conversationSummary}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Admin Notes</h4>
                        {editingNotes === lead.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={notesValue}
                              onChange={(e) => setNotesValue(e.target.value)}
                              placeholder="Add notes about this lead..."
                              className="min-h-[100px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveNotes(lead.id)}
                                disabled={updateMutation.isPending}
                              >
                                Save Notes
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingNotes(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotes(lead.id);
                              setNotesValue(lead.notes || "");
                            }}
                            className="bg-gray-50 rounded-lg p-3 text-sm min-h-[60px] cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            {lead.notes || (
                              <span className="text-muted-foreground italic">
                                Click to add notes...
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
