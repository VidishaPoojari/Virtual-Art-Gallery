
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Define the Comment type
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Define the Artwork type
export interface Artwork {
  id: string;
  title: string;
  description: string;
  category: "Painting" | "Digital Art" | "Photography" | "Other";
  imageUrl: string;
  studentId: string;
  studentName: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  likedBy: string[]; // Array of user IDs who liked the artwork
}

// Define the context type
interface ArtworkContextType {
  artworks: Artwork[];
  isLoading: boolean;
  getArtworkById: (id: string) => Artwork | undefined;
  getUserArtworks: (userId: string) => Artwork[];
  addComment: (artworkId: string, content: string) => Promise<void>;
  likeArtwork: (artworkId: string) => Promise<void>;
  uploadArtwork: (
    title: string,
    description: string,
    category: "Painting" | "Digital Art" | "Photography" | "Other",
    imageUrl: string
  ) => Promise<void>;
  updateArtwork: (
    id: string,
    title: string,
    description: string,
    category: "Painting" | "Digital Art" | "Photography" | "Other"
  ) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  shareArtwork: (id: string) => string;
}

// Create the context with default values
const ArtworkContext = createContext<ArtworkContextType>({
  artworks: [],
  isLoading: false,
  getArtworkById: () => undefined,
  getUserArtworks: () => [],
  addComment: async () => {},
  likeArtwork: async () => {},
  uploadArtwork: async () => {},
  updateArtwork: async () => {},
  deleteArtwork: async () => {},
  shareArtwork: () => "",
});

// Create a hook to use the artwork context
export const useArtwork = () => useContext(ArtworkContext);

// Sample artwork data
const initialArtworks: Artwork[] = [
  {
    id: "art-1",
    title: "Urban Architecture",
    description: "A study of lines and shapes in modern city buildings",
    category: "Painting",
    imageUrl: "https://images.unsplash.com/photo-1579783483458-83d02161294e?w=800&auto=format&fit=crop",
    studentId: "student-1",
    studentName: "Emma Johnson",
    createdAt: "2023-08-15T14:30:00Z",
    likes: 24,
    comments: [
      {
        id: "comment-1",
        userId: "student-2",
        userName: "Michael Chen",
        content: "I love the contrast in this piece!",
        createdAt: "2023-08-16T09:15:00Z",
      },
      {
        id: "comment-2",
        userId: "teacher-1",
        userName: "Professor Williams",
        content: "Excellent use of perspective, Emma. Consider exploring different angles for your next piece.",
        createdAt: "2023-08-16T14:22:00Z",
      },
    ],
    likedBy: ["student-2", "teacher-1", "student-3"],
  },
  {
    id: "art-2",
    title: "City Reflections",
    description: "Exploring the play of light on water in an urban setting",
    category: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&auto=format&fit=crop",
    studentId: "student-2",
    studentName: "Michael Chen",
    createdAt: "2023-09-02T18:45:00Z",
    likes: 18,
    comments: [
      {
        id: "comment-3",
        userId: "student-1",
        userName: "Emma Johnson",
        content: "The colors are stunning!",
        createdAt: "2023-09-03T10:35:00Z",
      },
    ],
    likedBy: ["student-1", "teacher-2"],
  },
  {
    id: "art-3",
    title: "Autumn Landscape",
    description: "A digital illustration capturing the essence of fall",
    category: "Digital Art",
    imageUrl: "https://images.unsplash.com/photo-1548759806-821c48c47ddf?w=800&auto=format&fit=crop",
    studentId: "student-3",
    studentName: "Sophia Martinez",
    createdAt: "2023-10-10T11:20:00Z",
    likes: 32,
    comments: [
      {
        id: "comment-4",
        userId: "student-2",
        userName: "Michael Chen",
        content: "Amazing color palette!",
        createdAt: "2023-10-10T16:48:00Z",
      },
      {
        id: "comment-5",
        userId: "teacher-1",
        userName: "Professor Williams",
        content: "Great work on blending those tones, Sophia. Let's discuss it in our next class.",
        createdAt: "2023-10-11T09:23:00Z",
      },
      {
        id: "comment-6",
        userId: "student-1",
        userName: "Emma Johnson",
        content: "This is so inspiring!",
        createdAt: "2023-10-11T14:17:00Z",
      },
    ],
    likedBy: ["student-1", "student-2", "teacher-1", "teacher-2"],
  },
];

// Provider component
interface ArtworkProviderProps {
  children: ReactNode;
}

export const ArtworkProvider: React.FC<ArtworkProviderProps> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load artworks from localStorage on initial render
  useEffect(() => {
    const loadArtworks = () => {
      const savedArtworks = localStorage.getItem("artworks");
      if (savedArtworks) {
        setArtworks(JSON.parse(savedArtworks));
      } else {
        // Use initial data if nothing in localStorage
        setArtworks(initialArtworks);
        localStorage.setItem("artworks", JSON.stringify(initialArtworks));
      }
    };

    loadArtworks();
    
    // Set up storage event listener to sync data across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "artworks" && e.newValue) {
        setArtworks(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Save artworks to localStorage
  const saveArtworks = (updatedArtworks: Artwork[]) => {
    setArtworks(updatedArtworks);
    localStorage.setItem("artworks", JSON.stringify(updatedArtworks));
  };

  // Get artwork by ID
  const getArtworkById = (id: string) => {
    return artworks.find((artwork) => artwork.id === id);
  };

  // Get artworks by user ID
  const getUserArtworks = (userId: string) => {
    return artworks.filter((artwork) => artwork.studentId === userId);
  };

  // Generate a shareable link for an artwork
  const shareArtwork = (id: string) => {
    const artwork = getArtworkById(id);
    if (!artwork) return "";
    
    const baseUrl = window.location.origin;
    const shareableLink = `${baseUrl}/artwork/${id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Shareable link has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to copy link",
          description: "Please try again or copy the URL manually",
        });
      });
    
    return shareableLink;
  };

  // Add a comment to an artwork
  const addComment = async (artworkId: string, content: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to comment",
      });
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const updatedArtworks = artworks.map((artwork) => {
        if (artwork.id === artworkId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            content,
            createdAt: new Date().toISOString(),
          };
          
          return {
            ...artwork,
            comments: [...artwork.comments, newComment],
          };
        }
        return artwork;
      });
      
      saveArtworks(updatedArtworks);
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add comment",
        description: "An error occurred while posting your comment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Like or unlike an artwork
  const likeArtwork = async (artworkId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to like artwork",
      });
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const updatedArtworks = artworks.map((artwork) => {
        if (artwork.id === artworkId) {
          // Check if user already liked this artwork
          const alreadyLiked = artwork.likedBy.includes(user.id);
          
          if (alreadyLiked) {
            // Unlike: remove user from likedBy and decrement likes
            return {
              ...artwork,
              likes: artwork.likes - 1,
              likedBy: artwork.likedBy.filter(id => id !== user.id),
            };
          } else {
            // Like: add user to likedBy and increment likes
            return {
              ...artwork,
              likes: artwork.likes + 1,
              likedBy: [...artwork.likedBy, user.id],
            };
          }
        }
        return artwork;
      });
      
      saveArtworks(updatedArtworks);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "An error occurred while processing your request",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload a new artwork
  const uploadArtwork = async (
    title: string,
    description: string,
    category: "Painting" | "Digital Art" | "Photography" | "Other", 
    imageUrl: string
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to upload artwork",
      });
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const newArtwork: Artwork = {
        id: `art-${Date.now()}`,
        title,
        description,
        category,
        imageUrl,
        studentId: user.id,
        studentName: user.name,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        likedBy: [] // Initialize with empty array
      };
      
      const updatedArtworks = [...artworks, newArtwork];
      saveArtworks(updatedArtworks);
      
      toast({
        title: "Artwork uploaded",
        description: "Your artwork has been uploaded successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An error occurred during upload",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing artwork
  const updateArtwork = async (
    id: string,
    title: string,
    description: string,
    category: "Painting" | "Digital Art" | "Photography" | "Other"
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update artwork",
      });
      return;
    }

    const artwork = getArtworkById(id);
    
    if (!artwork) {
      toast({
        variant: "destructive",
        title: "Artwork not found",
        description: "The artwork you're trying to update doesn't exist",
      });
      return;
    }
    
    if (artwork.studentId !== user.id && user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You don't have permission to update this artwork",
      });
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const updatedArtworks = artworks.map((art) => {
        if (art.id === id) {
          return {
            ...art,
            title,
            description,
            category,
          };
        }
        return art;
      });
      
      saveArtworks(updatedArtworks);
      
      toast({
        title: "Artwork updated",
        description: "Your artwork has been updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An error occurred while updating your artwork",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an artwork
  const deleteArtwork = async (id: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to delete artwork",
      });
      return;
    }

    const artwork = getArtworkById(id);
    
    if (!artwork) {
      toast({
        variant: "destructive",
        title: "Artwork not found",
        description: "The artwork you're trying to delete doesn't exist",
      });
      return;
    }
    
    if (artwork.studentId !== user.id && user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You don't have permission to delete this artwork",
      });
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const updatedArtworks = artworks.filter((art) => art.id !== id);
      saveArtworks(updatedArtworks);
      
      toast({
        title: "Artwork deleted",
        description: "The artwork has been deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "An error occurred while deleting the artwork",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    artworks,
    isLoading,
    getArtworkById,
    getUserArtworks,
    addComment,
    likeArtwork,
    uploadArtwork,
    updateArtwork,
    deleteArtwork,
    shareArtwork,
  };

  return (
    <ArtworkContext.Provider value={value}>
      {children}
    </ArtworkContext.Provider>
  );
};
