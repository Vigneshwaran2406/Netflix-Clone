import React, { useState, useEffect } from 'react';
import { Movie } from '../services/tmdb';
import MovieCard from './MovieCard';

interface RelatedContentProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ movie, onMovieClick }) => {
  const [relatedContent, setRelatedContent] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        setLoading(true);
        
        // Get similar and recommended content
        let content: Movie[] = [];
        
        if (movie.similar?.results) {
          content = [...content, ...movie.similar.results];
        }
        
        if (movie.recommendations?.results) {
          content = [...content, ...movie.recommendations.results];
        }
        
        // Remove duplicates and current movie
        const uniqueContent = content
          .filter((item, index, self) => 
            item.id !== movie.id && 
            index === self.findIndex(t => t.id === item.id)
          )
          .slice(0, 8);
        
        // Add media_type if not present
        const contentWithMediaType = uniqueContent.map(item => ({
          ...item,
          media_type: item.media_type || movie.media_type
        }));
        
        setRelatedContent(contentWithMediaType);
      } catch (error) {
        console.error('Error fetching related content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedContent();
  }, [movie]);

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-white text-xl font-semibold mb-4">More Like This</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-none w-32 h-48 bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (relatedContent.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-white text-xl font-semibold mb-4">More Like This</h3>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
        {relatedContent.map((item) => (
          <div key={item.id} className="flex-none w-32 md:w-40">
            <MovieCard 
              movie={item} 
              onClick={onMovieClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedContent;