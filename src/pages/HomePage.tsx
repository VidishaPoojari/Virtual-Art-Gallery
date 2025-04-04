
import React from "react";
import { Link } from "react-router-dom";
import { useArtwork } from "@/contexts/ArtworkContext";
import MainLayout from "@/components/layout/MainLayout";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Search, Users } from "lucide-react";

const HomePage = () => {
  const { artworks } = useArtwork();
  
  // Get the latest 4 artworks
  const latestArtworks = [...artworks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Virtual Art Gallery for Student Exhibitions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              A digital space for students to showcase their creativity and connect with a wider audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/gallery">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Gallery
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Join as Artist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-art-primary" />
              <h3 className="text-xl font-semibold mb-2">Showcase Your Work</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your artwork with detailed descriptions and reach a wider audience.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-art-secondary" />
              <h3 className="text-xl font-semibold mb-2">Discover Art</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse through diverse collections and find artwork that resonates with you.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-art-accent" />
              <h3 className="text-xl font-semibold mb-2">Connect & Engage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Leave comments, feedback, and engage with the student artist community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Artwork Section */}
      {latestArtworks.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Recent Artwork</h2>
              <Link to="/gallery" className="text-art-primary hover:underline flex items-center">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {latestArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-art-primary to-art-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Share Your Art?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of student artists and showcase your creativity to the world.
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-art-primary hover:bg-gray-100"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
