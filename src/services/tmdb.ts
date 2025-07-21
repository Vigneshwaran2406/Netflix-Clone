
const API_KEY = 'e10d564ce9e659287210817b8bf34727'; // Get from https://www.themoviedb.org/settings/api
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const YOUTUBE_BASE_URL = 'https://www.youtube.com/embed';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  media_type?: 'movie' | 'tv';
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: Genre[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  budget?: number;
  revenue?: number;
  created_by?: Creator[];
  networks?: Network[];
  episode_run_time?: number[];
  in_production?: boolean;
  last_air_date?: string;
  type?: string;
  credits?: Credits;
  videos?: VideoResponse;
  similar?: MovieResponse;
  recommendations?: MovieResponse;
  images?: ImageResponse;
  external_ids?: ExternalIds;
}

export interface ImageResponse {
  backdrops: ImageItem[];
  posters: ImageItem[];
  profiles?: ImageItem[];
}

export interface ImageItem {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  vote_average: number;
}

export interface ExternalIds {
  imdb_id: string;
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
}

export interface SearchSuggestion {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResponse {
  results: Video[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchFilters {
  query?: string;
  genre?: number;
  year?: number;
  sortBy?: 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'release_date.desc' | 'release_date.asc';
  minRating?: number;
  mediaType?: 'movie' | 'tv' | 'all';
  with_genres?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  'vote_average.gte'?: number;
}

const tmdbApi = {
  get: async (endpoint: string, params: Record<string, any> = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    return response.json();
  }
};

export const movieService = {
  // Trending content
  getTrendingMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/trending/movie/week');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getTrendingTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/trending/tv/week');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Popular content
  getPopularMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/popular');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getPopularTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/popular');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Top rated content
  getTopRatedMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/top_rated');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getTopRatedTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/top_rated');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Now playing movies
  getNowPlayingMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/now_playing');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  // Upcoming movies
  getUpcomingMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/upcoming');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  // On the air TV shows
  getOnTheAirTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/on_the_air');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Airing today TV shows
  getAiringTodayTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/airing_today');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Search with filters
  searchWithFilters: async (filters: SearchFilters): Promise<Movie[]> => {
    let results: Movie[] = [];

    if (filters.query) {
      // Multi search for query
      if (filters.mediaType === 'all' || !filters.mediaType) {
        const response = await tmdbApi.get('/search/multi', {
          query: filters.query,
          page: 1
        });
        results = response.results.filter((item: Movie) => 
          item.media_type === 'movie' || item.media_type === 'tv'
        );
      } else if (filters.mediaType === 'movie') {
        const response = await tmdbApi.get('/search/movie', {
          query: filters.query,
          page: 1
        });
        results = response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
      } else if (filters.mediaType === 'tv') {
        const response = await tmdbApi.get('/search/tv', {
          query: filters.query,
          page: 1
        });
        results = response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
      }
    } else {
      // Discover content with filters
      if (filters.mediaType === 'movie' || !filters.mediaType) {
        const movieParams: Record<string, any> = {
          sort_by: filters.sortBy || 'popularity.desc',
          page: 1
        };
        
        if (filters.genre) movieParams.with_genres = filters.genre.toString();
        if (filters.year) movieParams.primary_release_year = filters.year;
        if (filters.minRating) movieParams['vote_average.gte'] = filters.minRating;

        const movieResponse = await tmdbApi.get('/discover/movie', movieParams);
        const movies = movieResponse.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
        results = [...results, ...movies];
      }

      if (filters.mediaType === 'tv' || !filters.mediaType) {
        const tvParams: Record<string, any> = {
          sort_by: filters.sortBy || 'popularity.desc',
          page: 1
        };
        
        if (filters.genre) tvParams.with_genres = filters.genre.toString();
        if (filters.year) tvParams.first_air_date_year = filters.year;
        if (filters.minRating) tvParams['vote_average.gte'] = filters.minRating;

        const tvResponse = await tmdbApi.get('/discover/tv', tvParams);
        const shows = tvResponse.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
        results = [...results, ...shows];
      }
    }

    // Apply additional client-side filtering if needed
    if (filters.minRating && results.length > 0) {
      results = results.filter(item => item.vote_average >= (filters.minRating || 0));
    }

    // Remove duplicates and limit results
    const uniqueResults = results.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    return uniqueResults.slice(0, 20);
  },

  // Get detailed information
  getMovieDetails: async (id: number): Promise<Movie> => {
    const [details, credits, videos, similar, recommendations, images, externalIds] = await Promise.all([
      tmdbApi.get(`/movie/${id}`),
      tmdbApi.get(`/movie/${id}/credits`),
      tmdbApi.get(`/movie/${id}/videos`),
      tmdbApi.get(`/movie/${id}/similar`),
      tmdbApi.get(`/movie/${id}/recommendations`),
      tmdbApi.get(`/movie/${id}/images`),
      tmdbApi.get(`/movie/${id}/external_ids`)
    ]);

    return {
      ...details,
      media_type: 'movie',
      credits,
      videos,
      similar,
      recommendations,
      images,
      external_ids: externalIds
    };
  },

  getTVShowDetails: async (id: number): Promise<Movie> => {
    const [details, credits, videos, similar, recommendations, images, externalIds] = await Promise.all([
      tmdbApi.get(`/tv/${id}`),
      tmdbApi.get(`/tv/${id}/credits`),
      tmdbApi.get(`/tv/${id}/videos`),
      tmdbApi.get(`/tv/${id}/similar`),
      tmdbApi.get(`/tv/${id}/recommendations`),
      tmdbApi.get(`/tv/${id}/images`),
      tmdbApi.get(`/tv/${id}/external_ids`)
    ]);

    return {
      ...details,
      media_type: 'tv',
      credits,
      videos,
      similar,
      recommendations,
      images,
      external_ids: externalIds
    };
  },

  // Search suggestions for autocomplete
  getSearchSuggestions: async (query: string): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return [];
    
    const response = await tmdbApi.get('/search/multi', {
      query: query.trim(),
      page: 1
    });
    
    return response.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person')
      .slice(0, 8);
  },

  // Get genres
  getMovieGenres: async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.genres;
  },

  getTVGenres: async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.genres;
  },

  // Get content by genre
  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    const response = await tmdbApi.get('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc'
    });
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getTVShowsByGenre: async (genreId: number): Promise<Movie[]> => {
    const response = await tmdbApi.get('/discover/tv', {
      with_genres: genreId,
      sort_by: 'popularity.desc'
    });
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  }
};

// Utility functions
export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  const baseUrl = size === 'original' ? BACKDROP_BASE_URL : IMAGE_BASE_URL;
  return `${baseUrl}${path}`;
};

export const getTitle = (item: Movie): string => {
  return item.title || item.name || 'Unknown Title';
};

export const getReleaseDate = (item: Movie): string => {
  return item.release_date || item.first_air_date || '';
};

export const getReleaseYear = (item: Movie): string => {
  const date = getReleaseDate(item);
  return date ? new Date(date).getFullYear().toString() : '';
};

export const getRuntime = (item: Movie): string => {
  if (item.media_type === 'movie' && item.runtime) {
    const hours = Math.floor(item.runtime / 60);
    const minutes = item.runtime % 60;
    return `${hours}h ${minutes}m`;
  }
  if (item.media_type === 'tv' && item.episode_run_time && item.episode_run_time.length > 0) {
    return `${item.episode_run_time[0]}m per episode`;
  }
  return '';
};

export const getTrailerKey = (videos: VideoResponse | undefined): string | null => {
  if (!videos || !videos.results) return null;
  
  const trailer = videos.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube' && video.official
  ) || videos.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos.results.find(video => 
    video.site === 'YouTube'
  );
  
  return trailer ? trailer.key : null;
};

// Favorites management using localStorage
export const favoritesService = {
  getFavorites: (): Movie[] => {
    try {
      const favorites = localStorage.getItem('netflix-favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addToFavorites: (movie: Movie): void => {
    try {
      const favorites = favoritesService.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (!isAlreadyFavorite) {
        favorites.push(movie);
        localStorage.setItem('netflix-favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  removeFromFavorites: (id: number): void => {
    try {
      const favorites = favoritesService.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      localStorage.setItem('netflix-favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  isFavorite: (id: number): boolean => {
    try {
      const favorites = favoritesService.getFavorites();
      return favorites.some(fav => fav.id === id);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
};
/*

import axios from "axios";

const API_KEY = 'e10d564ce9e659287210817b8bf34727'; // Get from https://www.themoviedb.org/settings/api
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const YOUTUBE_BASE_URL = 'https://www.youtube.com/embed';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  media_type?: 'movie' | 'tv';
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: Genre[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  budget?: number;
  revenue?: number;
  created_by?: Creator[];
  networks?: Network[];
  episode_run_time?: number[];
  in_production?: boolean;
  last_air_date?: string;
  type?: string;
  credits?: Credits;
  videos?: VideoResponse;
  similar?: MovieResponse;
  recommendations?: MovieResponse;
  images?: ImageResponse;
  external_ids?: ExternalIds;
}

export interface ImageResponse {
  backdrops: ImageItem[];
  posters: ImageItem[];
  profiles?: ImageItem[];
}

export interface ImageItem {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  vote_average: number;
}

export interface ExternalIds {
  imdb_id: string;
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
}

export interface SearchSuggestion {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResponse {
  results: Video[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchFilters {
  query?: string;
  genre?: number;
  year?: number;
  sortBy?: 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'release_date.desc' | 'release_date.asc';
  minRating?: number;
  mediaType?: 'movie' | 'tv' | 'all';
  with_genres?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  'vote_average.gte'?: number;
}

const tmdbApi = {
  get: async (endpoint: string, params: Record<string, any> = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    return response.json();
  }
};

export const movieService = {
  // Trending content
  getTrendingMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/trending/movie/week');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getTrendingTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/trending/tv/week');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Popular content
  getPopularMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/popular');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getPopularTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/popular');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Top rated content
  getTopRatedMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/top_rated');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getTopRatedTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/top_rated');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Now playing movies
  getNowPlayingMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/now_playing');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  // Upcoming movies
  getUpcomingMovies: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/movie/upcoming');
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  // On the air TV shows
  getOnTheAirTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/on_the_air');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Airing today TV shows
  getAiringTodayTVShows: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get('/tv/airing_today');
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  },

  // Search with filters - UPDATED IMPLEMENTATION
  searchWithFilters: async (filters: SearchFilters): Promise<Movie[]> => {
    let params: Record<string, any> = {
      sort_by: filters.sortBy || 'popularity.desc'
    };

    // Apply filters based on media type
    if (filters.mediaType === 'movie' || filters.mediaType === 'all') {
      if (filters.genre) params.with_genres = filters.genre.toString();
      if (filters.year) params.primary_release_year = filters.year;
      if (filters.minRating) params['vote_average.gte'] = filters.minRating;
    }

    if (filters.mediaType === 'tv' || filters.mediaType === 'all') {
      if (filters.genre) params.with_genres = filters.genre.toString();
      if (filters.year) params.first_air_date_year = filters.year;
      if (filters.minRating) params['vote_average.gte'] = filters.minRating;
    }

    // Perform the search
    let results: Movie[] = [];
    if (filters.query) {
      const response = await tmdbApi.get('/search/multi', {
        ...params,
        query: filters.query
      });
      results = response.results.filter((item: any) => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );
    } else {
      // Discover content when no query but filters exist
      if (filters.mediaType === 'movie' || filters.mediaType === 'all') {
        const movieResponse = await tmdbApi.get('/discover/movie', params);
        results = [...results, ...movieResponse.results.map((m: Movie) => ({ ...m, media_type: 'movie' }))];
      }
      if (filters.mediaType === 'tv' || filters.mediaType === 'all') {
        const tvResponse = await tmdbApi.get('/discover/tv', params);
        results = [...results, ...tvResponse.results.map((m: Movie) => ({ ...m, media_type: 'tv' }))];
      }
    }

    // Deduplicate and limit results
    return results
      .filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
      .slice(0, 20);
  },

  // Get detailed information
  getMovieDetails: async (id: number): Promise<Movie> => {
    const [details, credits, videos, similar, recommendations, images, externalIds] = await Promise.all([
      tmdbApi.get(`/movie/${id}`),
      tmdbApi.get(`/movie/${id}/credits`),
      tmdbApi.get(`/movie/${id}/videos`),
      tmdbApi.get(`/movie/${id}/similar`),
      tmdbApi.get(`/movie/${id}/recommendations`),
      tmdbApi.get(`/movie/${id}/images`),
      tmdbApi.get(`/movie/${id}/external_ids`)
    ]);

    return {
      ...details,
      media_type: 'movie',
      credits,
      videos,
      similar,
      recommendations,
      images,
      external_ids: externalIds
    };
  },

  getTVShowDetails: async (id: number): Promise<Movie> => {
    const [details, credits, videos, similar, recommendations, images, externalIds] = await Promise.all([
      tmdbApi.get(`/tv/${id}`),
      tmdbApi.get(`/tv/${id}/credits`),
      tmdbApi.get(`/tv/${id}/videos`),
      tmdbApi.get(`/tv/${id}/similar`),
      tmdbApi.get(`/tv/${id}/recommendations`),
      tmdbApi.get(`/tv/${id}/images`),
      tmdbApi.get(`/tv/${id}/external_ids`)
    ]);

    return {
      ...details,
      media_type: 'tv',
      credits,
      videos,
      similar,
      recommendations,
      images,
      external_ids: externalIds
    };
  },

  // Search suggestions for autocomplete
  getSearchSuggestions: async (query: string): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return [];
    
    const response = await tmdbApi.get('/search/multi', {
      query: query.trim(),
      page: 1
    });
    
    return response.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person')
      .slice(0, 8);
  },

  // Get genres
  getMovieGenres: async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.genres;
  },

  getTVGenres: async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.genres;
  },

  // Get content by genre
  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    const response = await tmdbApi.get('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc'
    });
    return response.results.map((movie: Movie) => ({ ...movie, media_type: 'movie' }));
  },

  getTVShowsByGenre: async (genreId: number): Promise<Movie[]> => {
    const response = await tmdbApi.get('/discover/tv', {
      with_genres: genreId,
      sort_by: 'popularity.desc'
    });
    return response.results.map((show: Movie) => ({ ...show, media_type: 'tv' }));
  }
};

// Utility functions
export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  const baseUrl = size === 'original' ? BACKDROP_BASE_URL : IMAGE_BASE_URL;
  return `${baseUrl}${path}`;
};

export const getTitle = (item: Movie): string => {
  return item.title || item.name || 'Unknown Title';
};

export const getReleaseDate = (item: Movie): string => {
  return item.release_date || item.first_air_date || '';
};

export const getReleaseYear = (item: Movie): string => {
  const date = getReleaseDate(item);
  return date ? new Date(date).getFullYear().toString() : '';
};

export const getRuntime = (item: Movie): string => {
  if (item.media_type === 'movie' && item.runtime) {
    const hours = Math.floor(item.runtime / 60);
    const minutes = item.runtime % 60;
    return `${hours}h ${minutes}m`;
  }
  if (item.media_type === 'tv' && item.episode_run_time && item.episode_run_time.length > 0) {
    return `${item.episode_run_time[0]}m per episode`;
  }
  return '';
};

export const getTrailerKey = (videos: VideoResponse | undefined): string | null => {
  if (!videos || !videos.results) return null;
  
  const trailer = videos.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube' && video.official
  ) || videos.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos.results.find(video => 
    video.site === 'YouTube'
  );
  
  return trailer ? trailer.key : null;
};

// Favorites management using localStorage
export const favoritesService = {
  getFavorites: (): Movie[] => {
    try {
      const favorites = localStorage.getItem('netflix-favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addToFavorites: (movie: Movie): void => {
    try {
      const favorites = favoritesService.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (!isAlreadyFavorite) {
        favorites.push(movie);
        localStorage.setItem('netflix-favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  removeFromFavorites: (id: number): void => {
    try {
      const favorites = favoritesService.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      localStorage.setItem('netflix-favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  isFavorite: (id: number): boolean => {
    try {
      const favorites = favoritesService.getFavorites();
      return favorites.some(fav => fav.id === id);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
};
*/