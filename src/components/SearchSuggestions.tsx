import React from 'react';
import { Search, User, Film, Tv } from 'lucide-react';
import { SearchSuggestion, getImageUrl, getTitle } from '../services/tmdb';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  query: string;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  query,
  onSuggestionClick,
  isVisible
}) => {
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'movie':
        return <Film size={16} className="text-blue-400" />;
      case 'tv':
        return <Tv size={16} className="text-green-400" />;
      case 'person':
        return <User size={16} className="text-purple-400" />;
      default:
        return <Search size={16} className="text-gray-400" />;
    }
  };

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-600 rounded-b-lg shadow-xl z-50 max-h-80 overflow-y-auto">
      {suggestions.map((suggestion) => (
        <button
          key={`${suggestion.media_type}-${suggestion.id}`}
          onClick={() => onSuggestionClick(suggestion)}
          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-800 transition-colors text-left"
        >
          <div className="flex-shrink-0">
            {suggestion.poster_path || suggestion.profile_path ? (
              <img
                src={getImageUrl(suggestion.poster_path ?? suggestion.profile_path ?? null, 'w500')}
                alt={suggestion.title || suggestion.name}
                className="w-12 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">
                {getIcon(suggestion.media_type)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {getIcon(suggestion.media_type)}
              <span className="text-white font-medium truncate">
                {highlightMatch(getTitle(suggestion), query)}
              </span>
            </div>
            
            {(suggestion.release_date || suggestion.first_air_date) && (
              <div className="text-gray-400 text-sm">
                {new Date(suggestion.release_date || suggestion.first_air_date || '').getFullYear()}
              </div>
            )}
            
            <div className="text-gray-500 text-xs capitalize">
              {suggestion.media_type === 'tv' ? 'TV Show' : suggestion.media_type}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;