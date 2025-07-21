import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { Movie, movieService, favoritesService, SearchFilters } from './services/tmdb';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HorizontalSlider from './components/HorizontalSlider';
import MovieModal from './components/MovieModal';
import LoadingSpinner from './components/LoadingSpinner';
import SearchFiltersComponent from './components/SearchFilters';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [onTheAirTVShows, setOnTheAirTVShows] = useState<Movie[]>([]);
  const [airingTodayTVShows, setAiringTodayTVShows] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    mediaType: 'all',
    sortBy: 'popularity.desc'
  });

  useEffect(() => {
    if (user) {
      loadMovies();
      loadFavorites();
    }
  }, [user]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [
        trendingMoviesData,
        trendingTVShowsData,
        popularMoviesData,
        popularTVShowsData,
        topRatedMoviesData,
        topRatedTVShowsData,
        nowPlayingMoviesData,
        upcomingMoviesData,
        onTheAirTVShowsData,
        airingTodayTVShowsData
      ] = await Promise.all([
        movieService.getTrendingMovies(),
        movieService.getTrendingTVShows(),
        movieService.getPopularMovies(),
        movieService.getPopularTVShows(),
        movieService.getTopRatedMovies(),
        movieService.getTopRatedTVShows(),
        movieService.getNowPlayingMovies(),
        movieService.getUpcomingMovies(),
        movieService.getOnTheAirTVShows(),
        movieService.getAiringTodayTVShows()
      ]);

      setTrendingMovies(trendingMoviesData);
      setTrendingTVShows(trendingTVShowsData);
      setPopularMovies(popularMoviesData);
      setPopularTVShows(popularTVShowsData);
      setTopRatedMovies(topRatedMoviesData);
      setTopRatedTVShows(topRatedTVShowsData);
      setNowPlayingMovies(nowPlayingMoviesData);
      setUpcomingMovies(upcomingMoviesData);
      setOnTheAirTVShows(onTheAirTVShowsData);
      setAiringTodayTVShows(airingTodayTVShowsData);
      setHeroMovie(trendingMoviesData[0] || popularMoviesData[0] || null);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const userFavorites = favoritesService.getFavorites();
    setFavorites(userFavorites);
  };

  const handleSearch = async (query: string, filters?: SearchFilters) => {
    setSearchQuery(query);
    
    const finalFilters = filters || searchFilters;
    if (query.trim() || Object.keys(finalFilters).some(key => 
      key !== 'mediaType' && key !== 'sortBy' && finalFilters[key as keyof SearchFilters]
    )) {
      setActiveSection('search');
      try {
        const searchData = await movieService.searchWithFilters({
          ...finalFilters,
          query: query.trim() || undefined
        });
        setSearchResults(searchData);
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setActiveSection('home');
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // Trigger search with current query and new filters
    if (searchQuery.trim() || Object.keys(filters).some(key => 
      key !== 'mediaType' && key !== 'sortBy' && filters[key as keyof SearchFilters]
    )) {
      handleSearch(searchQuery, filters);
    }
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSearchQuery('');
    setSearchResults([]);
    setShowFilters(false);
    if (section === 'favorites') {
      loadFavorites();
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handlePlayClick = (movie: Movie) => {
    // In a real app, this would navigate to the video player
    console.log('Playing movie:', movie.title || movie.name);
    handleMovieClick(movie);
  };

  const handleInfoClick = (movie: Movie) => {
    handleMovieClick(movie);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleFavoriteToggle = () => {
    loadFavorites();
  };

  const renderContent = () => {
    if (activeSection === 'search') {
      return (
        <div className="pt-20">
          {showFilters && (
            <div className="px-4 md:px-8">
              <SearchFiltersComponent
                onFiltersChange={handleFiltersChange}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />
            </div>
          )}
          <HorizontalSlider
            title={searchQuery ? `Search results for "${searchQuery}"` : 'Filtered Results'}
            movies={searchResults}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      );
    }

    if (activeSection === 'movies') {
      return (
        <div className="pt-20">
          <HorizontalSlider
            title="Trending Movies"
            movies={trendingMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Now Playing"
            movies={nowPlayingMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Popular Movies"
            movies={popularMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Top Rated Movies"
            movies={topRatedMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Upcoming Movies"
            movies={upcomingMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      );
    }

    if (activeSection === 'tvshows') {
      return (
        <div className="pt-20">
          <HorizontalSlider
            title="Trending TV Shows"
            movies={trendingTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Airing Today"
            movies={airingTodayTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="On The Air"
            movies={onTheAirTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Popular TV Shows"
            movies={popularTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Top Rated TV Shows"
            movies={topRatedTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      );
    }

    if (activeSection === 'favorites') {
      return (
        <div className="pt-20">
          {favorites.length > 0 ? (
            <HorizontalSlider
              title="My Favorites"
              movies={favorites}
              onMovieClick={handleMovieClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h2 className="text-white text-2xl font-semibold mb-4">No favorites yet</h2>
                <p className="text-gray-400">Add movies and TV shows to your favorites to see them here</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Home section
    return (
      <>
        <HeroSection
          movie={heroMovie}
          onPlayClick={handlePlayClick}
          onInfoClick={handleInfoClick}
        />
        
        <HorizontalSlider
          title="Trending Movies"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Popular Movies"
          movies={popularMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Trending TV Shows"
          movies={trendingTVShows}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Top Rated Movies"
          movies={topRatedMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Now Playing"
          movies={nowPlayingMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </>
    );
  };
  
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header 
          onSearch={handleSearch} 
          onNavigate={handleNavigate}
          activeSection={activeSection}
        />
        
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-red-600 text-6xl md:text-8xl font-bold mb-8">
              NETFLIX
            </h1>
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-4">
              Unlimited movies, TV shows, and more
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
              Watch anywhere. Cancel anytime. Ready to watch? Sign in to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onSearch={handleSearch} 
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />
      
      {renderContent()}
      
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
        onMovieClick={handleMovieClick}
      />
    </div>
  );
}

export default App;
/*
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { Movie, movieService, favoritesService, SearchFilters } from './services/tmdb';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HorizontalSlider from './components/HorizontalSlider';
import MovieModal from './components/MovieModal';
import LoadingSpinner from './components/LoadingSpinner';
import SearchFiltersComponent from './components/SearchFilters';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [onTheAirTVShows, setOnTheAirTVShows] = useState<Movie[]>([]);
  const [airingTodayTVShows, setAiringTodayTVShows] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    mediaType: 'all',
    sortBy: 'popularity.desc'
  });

  useEffect(() => {
    if (user) {
      loadMovies();
      loadFavorites();
    }
  }, [user]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [
        trendingMoviesData,
        trendingTVShowsData,
        popularMoviesData,
        popularTVShowsData,
        topRatedMoviesData,
        topRatedTVShowsData,
        nowPlayingMoviesData,
        upcomingMoviesData,
        onTheAirTVShowsData,
        airingTodayTVShowsData
      ] = await Promise.all([
        movieService.getTrendingMovies(),
        movieService.getTrendingTVShows(),
        movieService.getPopularMovies(),
        movieService.getPopularTVShows(),
        movieService.getTopRatedMovies(),
        movieService.getTopRatedTVShows(),
        movieService.getNowPlayingMovies(),
        movieService.getUpcomingMovies(),
        movieService.getOnTheAirTVShows(),
        movieService.getAiringTodayTVShows()
      ]);

      setTrendingMovies(trendingMoviesData);
      setTrendingTVShows(trendingTVShowsData);
      setPopularMovies(popularMoviesData);
      setPopularTVShows(popularTVShowsData);
      setTopRatedMovies(topRatedMoviesData);
      setTopRatedTVShows(topRatedTVShowsData);
      setNowPlayingMovies(nowPlayingMoviesData);
      setUpcomingMovies(upcomingMoviesData);
      setOnTheAirTVShows(onTheAirTVShowsData);
      setAiringTodayTVShows(airingTodayTVShowsData);
      setHeroMovie(trendingMoviesData[0] || popularMoviesData[0] || null);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const userFavorites = favoritesService.getFavorites();
    setFavorites(userFavorites);
  };

  const handleSearch = async (query: string, filters?: SearchFilters) => {
    setSearchQuery(query);
    const finalFilters = {
      ...searchFilters,
      ...(filters || {})
    };

    try {
      setLoading(true);
      const searchData = await movieService.searchWithFilters({
        ...finalFilters,
        query: query.trim() || undefined
      });
      setSearchResults(searchData);
      setActiveSection('search');
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
    if (searchQuery.trim() || Object.keys(filters).some(key => 
      key !== 'mediaType' && key !== 'sortBy' && filters[key as keyof SearchFilters]
    )) {
      handleSearch(searchQuery, filters);
      console.log('Current filters:', filters);
    }
  };
  

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSearchQuery('');
    setSearchResults([]);
    setShowFilters(false);
    if (section === 'favorites') {
      loadFavorites();
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handlePlayClick = (movie: Movie) => {
    console.log('Playing movie:', movie.title || movie.name);
    handleMovieClick(movie);
  };

  const handleInfoClick = (movie: Movie) => {
    handleMovieClick(movie);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleFavoriteToggle = () => {
    loadFavorites();
  };

  const renderContent = () => {
    if (activeSection === 'search') {
      return (
        <div className="pt-20">
          {showFilters && (
            <div className="px-4 md:px-8">
              <SearchFiltersComponent
                onFiltersChange={handleFiltersChange}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />
              
            </div>
          )}
          {searchResults.length > 0 && (
            <HorizontalSlider
              title={searchQuery ? `Search results for "${searchQuery}"` : 'Filtered Results'}
              movies={searchResults}
              onMovieClick={handleMovieClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </div>
      );
    }

    if (activeSection === 'movies') {
      return (
        <div className="pt-20">
          <HorizontalSlider
            title="Trending Movies"
            movies={trendingMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Now Playing"
            movies={nowPlayingMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Popular Movies"
            movies={popularMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Top Rated Movies"
            movies={topRatedMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Upcoming Movies"
            movies={upcomingMovies}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      );
    }

    if (activeSection === 'tvshows') {
      return (
        <div className="pt-20">
          <HorizontalSlider
            title="Trending TV Shows"
            movies={trendingTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Airing Today"
            movies={airingTodayTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="On The Air"
            movies={onTheAirTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Popular TV Shows"
            movies={popularTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <HorizontalSlider
            title="Top Rated TV Shows"
            movies={topRatedTVShows}
            onMovieClick={handleMovieClick}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      );
    }

    if (activeSection === 'favorites') {
      return (
        <div className="pt-20">
          {favorites.length > 0 ? (
            <HorizontalSlider
              title="My Favorites"
              movies={favorites}
              onMovieClick={handleMovieClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h2 className="text-white text-2xl font-semibold mb-4">No favorites yet</h2>
                <p className="text-gray-400">Add movies and TV shows to your favorites to see them here</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Home section
    return (
      <>
        <HeroSection
          movie={heroMovie}
          onPlayClick={handlePlayClick}
          onInfoClick={handleInfoClick}
        />
        
        <HorizontalSlider
          title="Trending Movies"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Popular Movies"
          movies={popularMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Trending TV Shows"
          movies={trendingTVShows}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Top Rated Movies"
          movies={topRatedMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <HorizontalSlider
          title="Now Playing"
          movies={nowPlayingMovies}
          onMovieClick={handleMovieClick}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </>
    );
  };
  
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header 
          onSearch={handleSearch} 
          onNavigate={handleNavigate}
          activeSection={activeSection}
        />
        
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-red-600 text-6xl md:text-8xl font-bold mb-8">
              NETFLIX
            </h1>
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-4">
              Unlimited movies, TV shows, and more
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
              Watch anywhere. Cancel anytime. Ready to watch? Sign in to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onSearch={handleSearch} 
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />
      
      {loading && activeSection === 'search' ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {renderContent()}
          {!loading && searchResults.length === 0 && activeSection === 'search' && (
            <div className="text-center py-12 text-gray-400">
              No results found. Try different filters.
            </div>
          )}
        </>
      )}
      
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
        onMovieClick={handleMovieClick}
      />
    </div>
  );
}

export default App;*/