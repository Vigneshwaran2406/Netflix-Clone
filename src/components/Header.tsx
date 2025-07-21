import React, { useState } from 'react';
import { Search, User, LogOut, Heart, Filter, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SearchFilters, movieService, SearchSuggestion } from '../services/tmdb';
import SearchSuggestions from './SearchSuggestions';

interface HeaderProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onNavigate: (section: string) => void;
  activeSection: string;
  onToggleFilters?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNavigate, activeSection, onToggleFilters }) => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
    setShowSuggestions(false);
    setShowSearch(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for suggestions
    if (value.trim().length > 2) {
      const timeout = setTimeout(async () => {
        try {
          const searchSuggestions = await movieService.getSearchSuggestions(value);
          setSuggestions(searchSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      }, 300);
      setSearchTimeout(timeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const title = suggestion.title || suggestion.name || '';
    setSearchQuery(title);
    onSearch(title);
    setShowSuggestions(false);
    setShowSearch(false);
  };

  return (
    <header className="fixed top-0 w-full bg-black bg-opacity-90 backdrop-blur-sm z-50 transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold">NETFLIX</h1>
          
          {user && (
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className={`transition-colors ${activeSection === 'home' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('movies')}
                className={`transition-colors ${activeSection === 'movies' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
              >
                Movies
              </button>
              <button 
                onClick={() => onNavigate('tvshows')}
                className={`transition-colors ${activeSection === 'tvshows' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
              >
                TV Shows
              </button>
              <button 
                onClick={() => onNavigate('favorites')}
                className={`transition-colors flex items-center space-x-1 ${activeSection === 'favorites' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
              >
                <Heart size={16} />
                <span>My List</span>
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Search size={20} />
                </button>
                
                {showSearch && (
                  <div className="absolute right-0 top-10 bg-black bg-opacity-95 p-4 rounded-lg border border-gray-600 min-w-80 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Search</h3>
                      <button
                        onClick={() => {
                          setShowSearch(false);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="relative">
                    <form onSubmit={handleSearch} className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Search movies and TV shows..."
                        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-600"
                        autoFocus
                        onFocus={() => {
                          if (suggestions.length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        <Search size={16} />
                      </button>
                    </form>
                    
                    <SearchSuggestions
                      suggestions={suggestions}
                      query={searchQuery}
                      onSuggestionClick={handleSuggestionClick}
                      isVisible={showSuggestions}
                    />
                    </div>
                    
                    {onToggleFilters && (
                      <button
                        onClick={onToggleFilters}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        <Filter size={14} />
                        <span>Advanced Filters</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <img
                  src={user.photoURL || ''}
                  alt={user.displayName || ''}
                  className="w-8 h-8 rounded"
                />
                <button
                  onClick={logout}
                  className="text-white hover:text-gray-300 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}

          {!user && (
            <button
              onClick={signInWithGoogle}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors flex items-center space-x-2"
            >
              <User size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;