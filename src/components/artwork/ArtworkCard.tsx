import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Artwork, useArtwork } from "@/contexts/ArtworkContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { likeArtwork, shareArtwork, isLoading } = useArtwork();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to artwork detail
    e.stopPropagation(); // Stop event bubbling
    await likeArtwork(artwork.id);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to artwork detail
    e.stopPropagation(); // Stop event bubbling
    shareArtwork(artwork.id);
  };

  const isLikedByCurrentUser = user && artwork.likedBy?.includes(user.id);

  const fallbackImageUrl = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80";

  return (
    <Card className="artwork-card overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
      <Link to={`/artwork/${artwork.id}`} className="block">
        <div className="gallery-image-container relative overflow-hidden h-48 sm:h-56">
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 h-full w-full" />
          )}
          <img 
            src={imageError ? fallbackImageUrl : artwork.imageUrl} 
            alt={artwork.title}
            className={`gallery-image h-full w-full object-cover transition-transform duration-500 hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 text-white">
              <h4 className="text-sm font-semibold drop-shadow-md">{artwork.title}</h4>
              <p className="text-xs text-white/80 drop-shadow-md">{artwork.studentName}</p>
            </div>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <Link to={`/artwork/${artwork.id}`} className="hover:underline">
              <h3 className="font-semibold line-clamp-1">{artwork.title}</h3>
            </Link>
            <Badge variant="outline" className="ml-2 capitalize">
              {artwork.category}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {artwork.description}
          </p>
          
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-muted-foreground">by {artwork.studentName}</span>
            <span className="text-muted-foreground">{formatDate(artwork.createdAt)}</span>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <button 
              onClick={handleLikeClick}
              disabled={isLoading || !user}
              className={cn(
                "flex items-center gap-1 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Heart 
                className={cn(
                  "h-4 w-4", 
                  isLikedByCurrentUser && "fill-red-500 text-red-500"
                )} 
              />
              <span>{artwork.likes}</span>
            </button>
            <button
              onClick={handleShareClick}
              className="flex items-center gap-1 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{artwork.comments.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtworkCard;
