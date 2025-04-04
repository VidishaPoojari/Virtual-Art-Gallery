
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArtwork } from "@/contexts/ArtworkContext";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, AlertTriangle } from "lucide-react";
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

const AdminPage = () => {
  const { artworks, deleteArtwork } = useArtwork();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Redirect if not authenticated or not an admin
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  const handleViewArtwork = (id: string) => {
    navigate(`/artwork/${id}`);
  };

  const handleDeleteArtwork = async (id: string) => {
    setDeletingId(id);
    await deleteArtwork(id);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You don't have permission to view this page.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Admin View
          </Badge>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Tabs defaultValue="artworks">
            <div className="p-4 border-b">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="artworks">Artworks</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="artworks" className="p-4">
              <div className="mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  As an admin, you have the ability to view and manage all artworks in the gallery.
                </p>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableCaption>List of all artworks in the gallery</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artworks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No artworks found
                        </TableCell>
                      </TableRow>
                    ) : (
                      artworks.map((artwork) => (
                        <TableRow key={artwork.id}>
                          <TableCell className="font-medium">{artwork.title}</TableCell>
                          <TableCell>{artwork.studentName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{artwork.category}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(artwork.createdAt)}</TableCell>
                          <TableCell>{artwork.comments.length}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewArtwork(artwork.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete "{artwork.title}" by {artwork.studentName}.
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteArtwork(artwork.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    {deletingId === artwork.id ? "Deleting..." : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Total Artworks</h3>
                  <p className="text-3xl font-bold">{artworks.length}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Total Comments</h3>
                  <p className="text-3xl font-bold">
                    {artworks.reduce((sum, artwork) => sum + artwork.comments.length, 0)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Category Breakdown</h3>
                  <div className="space-y-2">
                    {["Painting", "Digital Art", "Photography", "Other"].map((category) => (
                      <div key={category} className="flex justify-between">
                        <span>{category}:</span>
                        <span className="font-medium">
                          {artworks.filter((art) => art.category === category).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
