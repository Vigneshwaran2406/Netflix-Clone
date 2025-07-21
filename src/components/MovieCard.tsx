import React from 'react';
import { Star, Play, Heart, Calendar, Tv, Globe } from 'lucide-react';
import { Movie, getImageUrl, getTitle, getReleaseYear, favoritesService, movieService } from '../services/tmdb';
import AutoPlayPreview from './AutoPlayPreview';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onFavoriteToggle?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onFavoriteToggle }) => {
  const isFavorite = favoritesService.isFavorite(movie.id);
  const [isHovered, setIsHovered] = React.useState(false);
  const [movieWithVideos, setMovieWithVideos] = React.useState<Movie>(movie);

  React.useEffect(() => {
    const loadVideos = async () => {
      if (isHovered && !movieWithVideos.videos) {
        try {
          const detailed = movie.media_type === 'tv' 
            ? await movieService.getTVShowDetails(movie.id)
            : await movieService.getMovieDetails(movie.id);
          setMovieWithVideos(detailed);
        } catch (error) {
          console.error('Error loading videos:', error);
        }
      }
    };

    loadVideos();
  }, [isHovered, movie, movieWithVideos.videos]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      favoritesService.removeFromFavorites(movie.id);
    } else {
      favoritesService.addToFavorites(movie);
    }
    onFavoriteToggle?.();
  };

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
      onClick={() => onClick(movie)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <AutoPlayPreview
          movie={movieWithVideos}
          isHovered={isHovered}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {movie.media_type === 'tv' && (
                  <div className="flex items-center space-x-1">
                    <Tv className="text-blue-400" size={12} />
                    <span className="text-blue-400 text-xs">TV</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="text-gray-400" size={12} />
                  <span className="text-gray-400 text-xs">{getReleaseYear(movie)}</span>
                </div>
              </div>
              
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Globe className="text-gray-400" size={12} />
                  <span className="text-gray-400 text-xs">{movie.spoken_languages[0].english_name}</span>
                </div>
              )}
              
              <button
                onClick={handleFavoriteClick}
                className={`p-1 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-red-600 hover:text-white'
                }`}
              >
                <Heart className={isFavorite ? 'fill-current' : ''} size={12} />
              </button>
            </div>
            
            <h3 className="text-white font-semibold text-sm md:text-base mb-2 line-clamp-2">
              {getTitle(movie)}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-400 fill-current" size={14} />
                <span className="text-white text-sm">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
              </div>
              
              <button className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors">
                <Play className="text-white" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;