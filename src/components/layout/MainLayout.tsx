
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Upload, Home, Search, Layers, Users } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-art-primary" />
            <span className="text-xl font-bold">Student Art Gallery</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 hover:text-art-primary transition-colors ${
                location.pathname === "/" ? "text-art-primary font-medium" : ""
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/gallery" 
              className={`flex items-center space-x-1 hover:text-art-primary transition-colors ${
                location.pathname === "/gallery" ? "text-art-primary font-medium" : ""
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Gallery</span>
            </Link>
            <Link 
              to="/search" 
              className={`flex items-center space-x-1 hover:text-art-primary transition-colors ${
                location.pathname === "/search" ? "text-art-primary font-medium" : ""
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
            {user?.role === "admin" && (
              <Link 
                to="/admin" 
                className={`flex items-center space-x-1 hover:text-art-primary transition-colors ${
                  location.pathname === "/admin" ? "text-art-primary font-medium" : ""
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === "student" && (
                  <Link to="/upload">
                    <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-1">
                      <Upload className="h-4 w-4 mr-1" />
                      <span>Upload</span>
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-normal text-xs opacity-70">
                      Signed in as {user?.role}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "student" && (
                      <DropdownMenuItem asChild>
                        <Link to="/my-artworks" className="cursor-pointer w-full">
                          My Artworks
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 focus:text-red-500"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="mt-auto border-t py-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Virtual Art Gallery for Student Exhibitions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
