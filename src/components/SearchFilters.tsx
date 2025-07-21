/*import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Genre, movieService, SearchFilters as SearchFiltersType } from '../services/tmdb';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFiltersType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange, isOpen, onToggle }) => {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [filters, setFilters] = useState<SearchFiltersType>({
    mediaType: 'all',
    sortBy: 'popularity.desc'
  });

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const [movieGenresData, tvGenresData] = await Promise.all([
          movieService.getMovieGenres(),
          movieService.getTVGenres()
        ]);
        setMovieGenres(movieGenresData);
        setTVGenres(tvGenresData);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };

    loadGenres();
  }, []);

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    // Convert empty strings to undefined for cleaner API calls
    Object.keys(newFilters).forEach(k => {
      const filterKey = k as keyof SearchFiltersType;
      if (newFilters[filterKey] === '' || newFilters[filterKey] === null) {
        delete newFilters[filterKey];
      }
    });
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFiltersType = {
      mediaType: 'all',
      sortBy: 'popularity.desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getGenres = () => {
    if (filters.mediaType === 'movie') return movieGenres;
    if (filters.mediaType === 'tv') return tvGenres;
    // Combine and deduplicate genres for 'all'
    const combined = [...movieGenres, ...tvGenres];
    return combined.filter((genre, index, self) => 
      index === self.findIndex(g => g.id === genre.id)
    );
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
      >
        <Filter size={16} />
        <span>Filters</span>
      </button>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Search Filters</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Media Type /}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Content Type
          </label>
          <select
            value={filters.mediaType || 'all'}
            onChange={(e) => handleFilterChange('mediaType', e.target.value as 'movie' | 'tv' | 'all')}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>

        {/* Genre /}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Genre
          </label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="">All Genres</option>
            {getGenres().map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year /}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Year
          </label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By /}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'popularity.desc'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="popularity.asc">Least Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="vote_average.asc">Lowest Rated</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>
        </div>

        {/* Minimum Rating /}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Minimum Rating
          </label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="">Any Rating</option>
            <option value="7">7+ Stars</option>
            <option value="8">8+ Stars</option>
            <option value="9">9+ Stars</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={clearFilters}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;*/
import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Genre, movieService, SearchFilters as SearchFiltersType } from '../services/tmdb';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFiltersType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange, isOpen, onToggle }) => {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [filters, setFilters] = useState<SearchFiltersType>({
    mediaType: 'all',
    sortBy: 'popularity.desc'
  });

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const [movieGenresData, tvGenresData] = await Promise.all([
          movieService.getMovieGenres(),
          movieService.getTVGenres()
        ]);
        setMovieGenres(movieGenresData);
        setTVGenres(tvGenresData);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };

    loadGenres();
  }, []);

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { 
      ...filters, 
      [key]: value === '' || value === null ? undefined : value 
    };
    setFilters(newFilters);
    // Immediately trigger search with new filters
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFiltersType = {
      mediaType: 'all',
      sortBy: 'popularity.desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getGenres = () => {
    if (filters.mediaType === 'movie') return movieGenres;
    if (filters.mediaType === 'tv') return tvGenres;
    // Combine and deduplicate genres for 'all'
    const combined = [...movieGenres, ...tvGenres];
    return combined.filter((genre, index, self) => 
      index === self.findIndex(g => g.id === genre.id)
    );
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        aria-label="Open filters"
      >
        <Filter size={16} />
        <span>Filters</span>
      </button>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Search Filters</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close filters"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Media Type */}
        <div>
          <label htmlFor="mediaType" className="block text-gray-300 text-sm font-medium mb-2">
            Content Type
          </label>
          <select
            id="mediaType"
            value={filters.mediaType || 'all'}
            onChange={(e) => handleFilterChange('mediaType', e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-gray-300 text-sm font-medium mb-2">
            Genre
          </label>
          <select
            id="genre"
            value={filters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="">All Genres</option>
            {getGenres().map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-gray-300 text-sm font-medium mb-2">
            Year
          </label>
          <select
            id="year"
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-gray-300 text-sm font-medium mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy || 'popularity.desc'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="popularity.asc">Least Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="vote_average.asc">Lowest Rated</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div>
          <label htmlFor="minRating" className="block text-gray-300 text-sm font-medium mb-2">
            Minimum Rating
          </label>
          <select
            id="minRating"
            value={filters.minRating || ''}
            onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="">Any Rating</option>
            <option value="7">7+ Stars</option>
            <option value="8">8+ Stars</option>
            <option value="9">9+ Stars</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={clearFilters}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default React.memo(SearchFilters);