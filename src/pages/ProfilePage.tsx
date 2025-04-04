
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, UserCheck, LogOut } from "lucide-react";

const ProfilePage = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Profile Information</CardTitle>
              <CardDescription>View and manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <User className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h2 className="font-medium text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined as {user.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-md">
                  <Mail className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <UserCheck className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              {user.role === "student" && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/my-artworks")}
                >
                  View My Artworks
                </Button>
              )}

              <Button 
                variant="destructive" 
                className="w-full flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
