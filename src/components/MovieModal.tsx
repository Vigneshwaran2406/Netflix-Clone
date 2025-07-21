import React from 'react';
import { X, Star, Calendar, Play, Heart, Tv, Clock, Globe, Award, Users } from 'lucide-react';
import { Movie, getImageUrl, getTitle, getReleaseDate, getRuntime, getTrailerKey, favoritesService } from '../services/tmdb';
import TrailerPlayer from './TrailerPlayer';
import RelatedContent from './RelatedContent';
import BehindTheScenes from './BehindTheScenes';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onMovieClick: (movie: Movie) => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, isOpen, onClose, onMovieClick }) => {
  const [showTrailer, setShowTrailer] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [detailedMovie, setDetailedMovie] = React.useState<Movie | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'details' | 'behind' | 'related'>('details');

  React.useEffect(() => {
    if (movie) {
      setIsFavorite(favoritesService.isFavorite(movie.id));
      loadDetailedInfo();
    }
  }, [movie]);

  const loadDetailedInfo = async () => {
    if (!movie) return;
    
    try {
      setLoading(true);
      const { movieService } = await import('../services/tmdb');
      const detailed = movie.media_type === 'tv' 
        ? await movieService.getTVShowDetails(movie.id)
        : await movieService.getMovieDetails(movie.id);
      setDetailedMovie(detailed);
    } catch (error) {
      console.error('Error loading detailed info:', error);
      setDetailedMovie(movie);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    if (isFavorite) {
      favoritesService.removeFromFavorites(movie.id);
    } else {
      favoritesService.addToFavorites(movie);
    }
    setIsFavorite(!isFavorite);
  };

  const displayMovie = detailedMovie || movie;
  const trailerKey = displayMovie?.videos ? getTrailerKey(displayMovie.videos) : null;

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {showTrailer && trailerKey ? (
            <TrailerPlayer 
              videoKey={trailerKey}
              onClose={() => setShowTrailer(false)}
            />
          ) : (
            <img
              src={getImageUrl(displayMovie?.backdrop_path || displayMovie?.poster_path, 'original')}
              alt={getTitle(displayMovie)}
              className="w-full h-64 md:h-80 object-cover rounded-t-lg"
            />
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          {!loading && (
            <div className="absolute bottom-4 left-4 flex space-x-3">
              {trailerKey && (
                <button 
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded flex items-center space-x-2 transition-colors"
                >
                  <Play className="fill-current" size={16} />
                  <span>{showTrailer ? 'Hide Trailer' : 'Watch Trailer'}</span>
                </button>
              )}
            
              <button
                onClick={handleFavoriteToggle}
                className={`px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                  isFavorite 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
              >
                <Heart className={isFavorite ? 'fill-current' : ''} size={16} />
                <span>{isFavorite ? 'Remove' : 'Add to List'}</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">{getTitle(displayMovie)}</h2>
              {displayMovie?.tagline && (
                <p className="text-gray-400 italic mb-2">{displayMovie.tagline}</p>
              )}
              {displayMovie?.media_type === 'tv' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Tv className="text-blue-400" size={16} />
                  <span className="text-blue-400 font-medium">TV Series</span>
                  {displayMovie.number_of_seasons && (
                    <span className="text-gray-400">• {displayMovie.number_of_seasons} Seasons</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-400 fill-current" size={16} />
              <span className="text-white font-semibold">{displayMovie?.vote_average ? displayMovie.vote_average.toFixed(1) : 'N/A'}</span>
              <span className="text-gray-400 text-sm">TMDB</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="text-gray-400" size={16} />
              <span className="text-gray-400">{getReleaseDate(displayMovie)}</span>
            </div>
            
            {getRuntime(displayMovie) && (
              <div className="flex items-center space-x-1">
                <Clock className="text-gray-400" size={16} />
                <span className="text-gray-400">{getRuntime(displayMovie)}</span>
              </div>
            )}
            
            {displayMovie?.spoken_languages && displayMovie.spoken_languages.length > 0 && (
              <div className="flex items-center space-x-1">
                <Globe className="text-gray-400" size={16} />
                <span className="text-gray-400">{displayMovie.spoken_languages[0].english_name}</span>
              </div>
            )}
          </div>
          
          {displayMovie?.genres && displayMovie.genres.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {displayMovie.genres.map((genre) => (
                  <span 
                    key={genre.id}
                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-gray-300 leading-relaxed mb-6 text-lg">
            {displayMovie?.overview || 'No description available.'}
          </p>
          
          
          {displayMovie && (
            <div className="mt-8">
              <div className="flex space-x-6 mb-6 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 px-1 transition-colors ${
                    activeTab === 'details'
                      ? 'text-white border-b-2 border-red-600'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('behind')}
                  className={`pb-2 px-1 transition-colors ${
                    activeTab === 'behind'
                      ? 'text-white border-b-2 border-red-600'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Behind the Scenes
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`pb-2 px-1 transition-colors ${
                    activeTab === 'related'
                      ? 'text-white border-b-2 border-red-600'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  More Like This
                </button>
              </div>

              {activeTab === 'details' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {displayMovie?.credits?.crew?.find(person => person.job === 'Director') && (
                    <div>
                      <span className="text-gray-400 text-sm font-medium">Director: </span>
                      <span className="text-white">
                        {displayMovie.credits.crew.filter(person => person.job === 'Director').map(director => director.name).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {displayMovie?.created_by && displayMovie.created_by.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm font-medium">Created by: </span>
                      <span className="text-white">{displayMovie.created_by.map(creator => creator.name).join(', ')}</span>
                    </div>
                  )}
                  
                  {displayMovie?.credits?.cast && displayMovie.credits.cast.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="flex items-start space-x-2 mb-3">
                        <Users className="text-blue-400 mt-1" size={16} />
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Main Cast: </span>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {displayMovie.credits.cast.slice(0, 6).map(actor => (
                              <div key={actor.id} className="text-white text-sm">
                                <div className="font-medium">{actor.name}</div>
                                <div className="text-gray-400 text-xs">{actor.character}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {displayMovie?.production_countries && displayMovie.production_countries.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm font-medium">Country: </span>
                      <span className="text-white">{displayMovie.production_countries[0].name}</span>
                    </div>
                  )}
                  
                  {displayMovie?.status && (
                    <div>
                      <div className="flex items-start space-x-2">
                        <Award className="text-green-400 mt-1" size={16} />
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Status: </span>
                          <span className="text-white">{displayMovie.status}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'behind' && (
                <BehindTheScenes movie={displayMovie} />
              )}

              {activeTab === 'related' && (
                <RelatedContent 
                  movie={displayMovie}
                  onMovieClick={onMovieClick}
                />
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;