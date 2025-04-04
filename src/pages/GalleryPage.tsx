
import React, { useState, useEffect } from "react";
import { useArtwork, Artwork } from "@/contexts/ArtworkContext";
import MainLayout from "@/components/layout/MainLayout";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const GalleryPage = () => {
  const { artworks } = useArtwork();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = ["Painting", "Digital Art", "Photography", "Other"];

  useEffect(() => {
    let result = [...artworks];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchLower) ||
          artwork.description.toLowerCase().includes(searchLower) ||
          artwork.studentName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (activeCategory) {
      result = result.filter(
        (artwork) => artwork.category === activeCategory
      );
    }
    
    // Sort by most recent
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredArtworks(result);
  }, [artworks, searchTerm, activeCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(prevCategory => prevCategory === category ? null : category);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6">Gallery</h1>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by title, description, or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center mb-6 overflow-x-auto py-2">
            <div className="mr-2 text-sm font-medium flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter:</span>
            </div>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={`whitespace-nowrap ${
                    activeCategory === category 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <ArtworkGrid artworks={filteredArtworks} />
        </div>
      </div>
    </MainLayout>
  );
};

export default GalleryPage;
