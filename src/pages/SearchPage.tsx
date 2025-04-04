
import React, { useState, useEffect } from "react";
import { useArtwork, Artwork } from "@/contexts/ArtworkContext";
import MainLayout from "@/components/layout/MainLayout";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SearchPage = () => {
  const { artworks, isLoading } = useArtwork();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Artwork[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const categories = ["Painting", "Digital Art", "Photography", "Other"];

  const handleSearch = () => {
    setHasSearched(true);
    
    let results = [...artworks];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchLower) ||
          artwork.description.toLowerCase().includes(searchLower) ||
          artwork.studentName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (activeCategory) {
      results = results.filter(
        (artwork) => artwork.category === activeCategory
      );
    }
    
    // Sort by most recent
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setSearchResults(results);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(prevCategory => prevCategory === category ? null : category);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveCategory(null);
    setHasSearched(false);
  };

  // Trigger search when category changes
  useEffect(() => {
    if (hasSearched) {
      handleSearch();
    }
  }, [activeCategory]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Artworks</h1>
          
          <div className="mb-6">
            <div className="relative flex">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by title, description, or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button 
                className="ml-2"
                onClick={handleSearch}
              >
                Search
              </Button>
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
            
            {(searchTerm || activeCategory) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-sm text-gray-500"
                onClick={handleClearSearch}
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <>
                <div className="text-sm text-gray-500 mb-4">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                <ArtworkGrid artworks={searchResults} />
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No matching artworks found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium mb-2">Search for artworks</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Enter keywords to search for artworks by title, description, or artist name.
                Use the filters to narrow your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchPage;
