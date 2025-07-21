import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie, getImageUrl, getTitle } from '../services/tmdb';

interface HeroSectionProps {
  movie: Movie | null;
  onPlayClick: (movie: Movie) => void;
  onInfoClick: (movie: Movie) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie, onPlayClick, onInfoClick }) => {
  if (!movie) return null;

  return (
    <div className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path || movie.poster_path, 'original')})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 h-full flex items-center px-4 md:px-8">
        <div className="max-w-xl">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            {getTitle(movie)}
          </h1>
          
          <p className="text-white text-lg md:text-xl mb-8 line-clamp-3">
            {movie.overview || 'No description available.'}
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={() => onPlayClick(movie)}
              className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded flex items-center space-x-2 font-semibold transition-colors"
            >
              <Play className="fill-current" size={20} />
              <span>Play</span>
            </button>
            
            <button
              onClick={() => onInfoClick(movie)}
              className="bg-gray-500 bg-opacity-70 hover:bg-opacity-50 text-white px-8 py-3 rounded flex items-center space-x-2 font-semibold transition-colors"
            >
              <Info size={20} />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;