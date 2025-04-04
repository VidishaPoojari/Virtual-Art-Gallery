
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useArtwork } from "@/contexts/ArtworkContext";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const UserArtworksPage = () => {
  const { getUserArtworks } = useArtwork();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not a student
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "student")) {
      navigate("/login");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  const userArtworks = user ? getUserArtworks(user.id) : [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Artworks</h1>
          
          <Link to="/upload">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Upload New Artwork
            </Button>
          </Link>
        </div>

        {userArtworks.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-medium mb-4">No artworks yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              You haven't uploaded any artwork yet. Start showcasing your creativity!
            </p>
            <Button onClick={() => navigate("/upload")}>
              Upload Your First Artwork
            </Button>
          </div>
        ) : (
          <ArtworkGrid artworks={userArtworks} />
        )}
      </div>
    </MainLayout>
  );
};

export default UserArtworksPage;
