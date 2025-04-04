
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useArtwork } from "@/contexts/ArtworkContext";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  MessageSquare,
  Heart,
  Edit,
  Trash2,
  ArrowLeft,
  Send,
  Loader2,
  Share2,
} from "lucide-react";
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

const ArtworkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getArtworkById, addComment, deleteArtwork, likeArtwork, shareArtwork, isLoading } = useArtwork();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const artwork = getArtworkById(id || "");

  if (!artwork) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
          <p className="mb-6">The artwork you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/gallery")}>Back to Gallery</Button>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addComment(artwork.id, comment);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArtwork = async () => {
    await deleteArtwork(artwork.id);
    navigate("/gallery");
  };

  const handleLikeArtwork = async () => {
    await likeArtwork(artwork.id);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if current user has liked this artwork
  const isLikedByCurrentUser = user && artwork.likedBy?.includes(user.id);

  const fallbackImageUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80";

  const canEditOrDelete = user && (user.id === artwork.studentId || user.role === "admin");

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/gallery" 
          className="inline-flex items-center text-art-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artwork Image */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="relative bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-2 min-h-[400px]">
                {!imageLoaded && !imageError && (
                  <Skeleton className="absolute inset-0 h-full w-full" />
                )}
                <img
                  src={imageError ? fallbackImageUrl : artwork.imageUrl}
                  alt={artwork.title}
                  className={`artwork-detail-image transition-all duration-500 hover:scale-105 max-w-full max-h-full ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{artwork.title}</h1>
                <Badge>{artwork.category}</Badge>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">{artwork.description}</p>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4 mr-1" />
                  <span>Artist: {artwork.studentName}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Uploaded on: {formatDate(artwork.createdAt)}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={!isAuthenticated || isLoading}
                    onClick={handleLikeArtwork}
                    className={cn(
                      "flex items-center gap-2",
                      !isAuthenticated && "cursor-not-allowed opacity-70"
                    )}
                  >
                    <Heart 
                      className={cn(
                        "h-5 w-5", 
                        isLikedByCurrentUser && "fill-red-500 text-red-500"
                      )} 
                    />
                    <span>{artwork.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareArtwork(artwork.id)}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </Button>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-5 w-5 mr-1" />
                    <span>{artwork.comments.length}</span>
                  </div>
                </div>
              </div>

              {canEditOrDelete && (
                <div className="mt-6 pt-6 border-t flex space-x-2">
                  <Link to={`/artwork/${artwork.id}/edit`}>
                    <Button variant="outline" className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          artwork and remove it from the gallery.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteArtwork}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>

              {isAuthenticated ? (
                <div className="mb-6">
                  <Textarea
                    placeholder="Add your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="resize-none mb-2"
                  />
                  <Button 
                    onClick={handleSubmitComment} 
                    disabled={!comment.trim() || isSubmitting}
                    className="flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
                  <p className="text-sm text-center">
                    <Link to="/login" className="text-art-primary font-medium hover:underline">
                      Log in
                    </Link>{" "}
                    to add your comment
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {artwork.comments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  artwork.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ArtworkDetailPage;
