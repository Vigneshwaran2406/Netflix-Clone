import React, { useState, useEffect, useRef } from 'react';
import { Movie, getImageUrl, getTrailerKey } from '../services/tmdb';

interface AutoPlayPreviewProps {
  movie: Movie;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const AutoPlayPreview: React.FC<AutoPlayPreviewProps> = ({ 
  movie, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isHovered) {
      timeoutRef.current = setTimeout(() => {
        setShowPreview(true);
        const key = getTrailerKey(movie.videos);
        setTrailerKey(key);
      }, 1500); // Delay before showing preview
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowPreview(false);
      setTrailerKey(null);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, movie]);

  return (
    <div 
      className="relative group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showPreview && trailerKey ? (
        <div className="absolute inset-0 z-20 rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      )}
    </div>
  );
};

export default AutoPlayPreview;