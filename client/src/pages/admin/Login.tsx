import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, User, Shield } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const utils = trpc.useUtils();

  // Check if already logged in
  const { data: session, isLoading: sessionLoading } = trpc.admin.checkSession.useQuery(undefined, {
    retry: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!sessionLoading && session?.isAuthenticated) {
      window.location.href = "/admin";
    }
  }, [session, sessionLoading]);

  // Handle redirect after successful login
  useEffect(() => {
    if (loginSuccess) {
      // Small delay to ensure cookie is set
      const timer = setTimeout(() => {
        window.location.href = "/admin";
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess]);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: async () => {
      toast.success("Login successful! Redirecting...");
      // Invalidate the session query to force re-check
      await utils.admin.checkSession.invalidate();
      // Set flag to trigger redirect
      setLoginSuccess(true);
    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    loginMutation.mutate({ username, password });
  };

  // Show loading while checking session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-white">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-heading">Umbrella Broadband</h1>
          <p className="text-gray-300 mt-1">Admin Portal</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={isLoading || loginSuccess}
                    autoComplete="username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading || loginSuccess}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading || loginSuccess}
              >
                {isLoading || loginSuccess ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loginSuccess ? "Redirecting..." : "Signing in..."}
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <a 
                href="/" 
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                ← Back to website
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-400 text-sm mt-6">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
