import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { LayoutDashboard, LogOut, PanelLeft, FileText, Mail, Home, Settings, Briefcase, FolderOpen, ChevronDown } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Mail, label: "Contact Inquiries", path: "/admin/contacts" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const contentItems = [
  { icon: Briefcase, label: "Case Studies", path: "/admin/case-studies" },
  { icon: FileText, label: "Blog Posts", path: "/admin/blog" },
];

const SIDEBAR_WIDTH_KEY = "admin-sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  
  // Use admin session check instead of OAuth
  const { data: session, isLoading } = trpc.admin.checkSession.useQuery();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      window.location.href = "/admin/login";
    }
  }, [session, isLoading]);

  if (isLoading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!session?.isAuthenticated) {
    return <DashboardLayoutSkeleton />;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <AdminLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </AdminLayoutContent>
    </SidebarProvider>
  );
}

type AdminLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function AdminLayoutContent({
  children,
  setSidebarWidth,
}: AdminLayoutContentProps) {
  const [location] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find((item) => item.path === location);
  const isMobile = useIsMobile();
  
  const utils = trpc.useUtils();
  
  // Admin logout mutation
  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: async () => {
      toast.success("Logged out successfully");
      // Clear all TRPC cache to prevent stale session data
      await utils.invalidate();
      // Use replace to prevent back navigation to authenticated pages
      window.location.replace("/admin/login");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
              {!isCollapsed && (
                <span className="font-semibold text-lg whitespace-nowrap">
                  Admin Panel
                </span>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="gap-1 px-2">
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/admin"}
                  tooltip="Dashboard"
                >
                  <Link href="/admin">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Content Management Section */}
              <SidebarMenuItem>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                  {!isCollapsed && "Content"}
                </div>
              </SidebarMenuItem>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.path || location.startsWith(item.path + "/")}
                    tooltip={item.label}
                  >
                    <Link href={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Other Items */}
              <SidebarMenuItem>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                  {!isCollapsed && "Manage"}
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/admin/contacts"}
                  tooltip="Contact Inquiries"
                >
                  <Link href="/admin/contacts">
                    <Mail className="h-5 w-5" />
                    <span>Contact Inquiries</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/admin/settings"}
                  tooltip="Settings"
                >
                  <Link href="/admin/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <div className="flex flex-col gap-2">
              {/* Admin info */}
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Admin</span>
                    <span className="text-xs text-muted-foreground">Administrator</span>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <Link href="/" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Home className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Website</span>}
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">Logout</span>}
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        {!isCollapsed && !isMobile && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors z-50"
            onMouseDown={() => setIsResizing(true)}
          />
        )}
      </div>
      <SidebarInset className="bg-slate-50">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:hidden">
          <SidebarTrigger className="-ml-1" />
          <span className="font-semibold">{activeMenuItem?.label}</span>
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </>
  );
}
