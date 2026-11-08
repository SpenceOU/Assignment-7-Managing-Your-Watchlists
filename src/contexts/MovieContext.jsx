import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const MovieContext = createContext();

// 2. The provider holds the watchlist state and shares it with the whole app
export function MovieProvider({ children }) {
  // Step 7: load the saved watchlist from localStorage when the app starts
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Could not load watchlist:', error);
      return [];
    }
  });

  // Step 7: save the watchlist to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Add a movie (skip it if it's already in the list)
  const addToWatchlist = (movie) => {
    setWatchlist(prev =>
      prev.some(m => m.id === movie.id) ? prev : [...prev, movie]
    );
  };

  // Remove a movie by its id
  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
  };

  // Check if a movie is already saved
  const isInWatchlist = (movieId) => {
    return watchlist.some(m => m.id === movieId);
  };

  return (
    <MovieContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </MovieContext.Provider>
  );
}

// 3. A shortcut hook so components can write useMovieContext()
// eslint-disable-next-line react-refresh/only-export-components
export function useMovieContext() {
  return useContext(MovieContext);
}
