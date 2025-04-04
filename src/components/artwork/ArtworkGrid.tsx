
import React from "react";
import { Artwork } from "@/contexts/ArtworkContext";
import ArtworkCard from "./ArtworkCard";
import { motion } from "framer-motion";

interface ArtworkGridProps {
  artworks: Artwork[];
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks }) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No artworks found</h3>
        <p className="text-muted-foreground mt-2">
          There are no artworks to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ArtworkCard artwork={artwork} />
        </motion.div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
