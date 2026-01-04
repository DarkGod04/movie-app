import React, { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { Search } from 'lucide-react'

const OMDB_API_KEY = "1e43b127";

const FALLBACK_MOVIES = [
  { _id: "fb1", id: "tt0499549", title: "Avatar", poster_path: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg", release_date: "2009", vote_average: "7.9" },
  { _id: "fb2", id: "tt0848228", title: "The Avengers", poster_path: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg", release_date: "2012", vote_average: "8.0" },
  { _id: "fb3", id: "tt10872600", title: "Spider-Man: No Way Home", poster_path: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtOGE2Yi00OGgxLWE3ZWYtZTE2NTQzMjYzZDcwXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg", release_date: "2021", vote_average: "8.2" },
  { _id: "fb4", id: "tt4154796", title: "Avengers: Endgame", poster_path: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODCWldlZt_V1_SX300.jpg", release_date: "2019", vote_average: "8.4" },
  { _id: "fb5", id: "tt2953050", title: "Encanto", poster_path: "https://m.media-amazon.com/images/M/MV5BNjE5NzA4ZDctOTE2NS00MWQ5LTk1ZWUtMDQ5Q2U2NTkyOTE3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_SX300.jpg", release_date: "2021", vote_average: "7.2" },
  { _id: "fb6", id: "tt1877830", title: "The Batman", poster_path: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg", release_date: "2022", vote_average: "7.8" },
  { _id: "fb7", id: "tt9376612", title: "Shang-Chi and the Legend of the Ten Rings", poster_path: "https://m.media-amazon.com/images/M/MV5BNTliYjlkNDQtMjFlNS00NjgzLWFhNzktY2U3NzY3MGE0YWJjXkEyXkFqcGdeQXVyMTkhOTcxOTY@._V1_SX300.jpg", release_date: "2021", vote_average: "7.4" },
  { _id: "fb8", id: "tt5968533", title: "Guardians of the Galaxy", poster_path: "https://m.media-amazon.com/images/M/MV5BNDIzMTk4NDYtMjg5OS00ZGI0LWJhZDYtMzdmZGY1YWQwMTE1XkEyXkFqcGdeQXVyMTA3MDk2NDg@._V1_SX300.jpg", release_date: "2014", vote_average: "8.0" },
  { _id: "fb9", id: "tt1630029", title: "Avatar: The Way of Water", poster_path: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzYtMTUyODg1NDBkNmQwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg", release_date: "2022", vote_average: "7.6" },
  { _id: "fb10", id: "tt2380307", title: "Coco", poster_path: "https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODUxOTU0OTg@._V1_SX300.jpg", release_date: "2017", vote_average: "8.4" },
];

const Movies = () => {
  const [movies, setMovies] = useState(FALLBACK_MOVIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Fetch from TVMaze (Fallback - No Key Required)
  const fetchTVMaze = async (query) => {
    try {
      console.log("Switching to TVMaze fallback...");
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      const transformed = data.map(item => ({
        _id: item.show.id,
        id: item.show.id,
        title: item.show.name,
        poster_path: item.show.image?.original || "https://via.placeholder.com/300x450?text=No+Poster",
        vote_average: item.show.rating?.average || "N/A",
        release_date: item.show.premiered?.split("-")[0] || "N/A"
      }));

      setMovies(transformed);
      setError("Note: OMDb Key Invalid. Showing results from TVMaze (Public API).");
      setHasMore(false); // TVMaze search is usually 1 page
    } catch (err) {
      console.error("TVMaze Error:", err);
      setError("All APIs failed. Please check your internet connection.");
    }
  };

  // --- Advanced Data Fetching & Sorting ---
  const [sortBy, setSortBy] = useState("newest");

  // Helper: Sort movies array based on current `sortBy` state
  const sortMovies = (list, sortType) => {
    const sorted = [...list];
    if (sortType === "newest") {
      return sorted.sort((a, b) => parseInt(b.release_date) - parseInt(a.release_date));
    } else if (sortType === "oldest") {
      return sorted.sort((a, b) => parseInt(a.release_date) - parseInt(b.release_date));
    } else if (sortType === "rating") {
      return sorted.sort((a, b) => {
        const valA = a.vote_average === "N/A" ? 0 : parseFloat(a.vote_average);
        const valB = b.vote_average === "N/A" ? 0 : parseFloat(b.vote_average);
        return valB - valA;
      });
    }
    return sorted;
  };

  // Helper: Fetch full details (Ratings, Year, Actors) for a batch of movies
  const fetchDetailedMovies = async (moviesList) => {
    // Limit parallel connections to avoid thrashing
    const detailed = await Promise.all(
      moviesList.map(async (movie) => {
        try {
          // Fetch individually by ID to get Plot, Rating, exact Year, Actors
          const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
          const data = await res.json();
          if (data.Response === "True") {
            return {
              ...movie,
              imdbRating: data.imdbRating,
              Year: data.Year,
              Actors: data.Actors // Added Actors
            };
          }
          return movie;
        } catch (e) {
          return movie;
        }
      })
    );
    return detailed;
  };

  // Helper: Standardize movie object format
  const transformMovie = (m) => ({
    _id: m.imdbID || m.id, // Handle OMDb or generic ID
    title: m.Title || m.title || m.name,
    poster_path: (m.Poster && m.Poster !== "N/A") ? m.Poster : (m.image?.original || "https://via.placeholder.com/300x450?text=No+Poster"),
    vote_average: (m.imdbRating && m.imdbRating !== "N/A") ? m.imdbRating : (m.rating?.average || "N/A"),
    release_date: m.Year || m.premiered?.split("-")[0] || "N/A",
    actors: m.Actors ? m.Actors.split(', ') : []
  });

  // Main Search Fetch
  const fetchMovies = async (query, pageNum = 1, append = false) => {
    const queryToUse = query.trim() === "" ? "Avengers" : query;
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching: ${queryToUse} page ${pageNum}`);
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(queryToUse)}&apikey=${OMDB_API_KEY}&type=movie&page=${pageNum}`);
      const data = await res.json();

      if (data.Response === "True") {
        // ENRICH DATA: Get ratings for every movie in the list
        const enrichedRaw = await fetchDetailedMovies(data.Search);
        const transformed = enrichedRaw.map(transformMovie);

        if (append) {
          setMovies(prev => {
            const combined = [...prev, ...transformed];
            // Remove duplicates
            const unique = Array.from(new Map(combined.map(m => [m._id, m])).values());
            return sortMovies(unique, sortBy);
          });
        } else {
          setMovies(sortMovies(transformed, sortBy));
        }
        setHasMore(data.Search.length === 10);
      } else {
        if (data.Error === "Invalid API key!" || data.Error === "Request limit reached!") {
          await fetchTVMaze(queryToUse);
        } else {
          if (!append) {
            setMovies([]);
            setError(data.Error);
          }
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
      await fetchTVMaze(queryToUse);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load: Fetch 3 pages + Enrich + Sort
  const fetchInitialMovies = async () => {
    setLoading(true);

    const randomKeywords = ["Marvel", "Star Wars", "Harry Potter", "Batman", "Inception", "Lord of the Rings", "Matrix", "Disney", "Pixar", "Dune", "Spiderman", "James Bond", "Mission Impossible"];
    const randomQuery = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];

    const query = randomQuery;
    setSearchTerm(query); // Optional: Set search term to show user what's being displayed

    try {
      console.log(`Starting initial fetch for: ${query}`);
      const promises = [1, 2, 3].map(page =>
        fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}&type=movie&page=${page}`)
          .then(res => res.json())
          .catch(err => ({ Response: "False", Error: err.message }))
      );

      const results = await Promise.allSettled(promises);
      let rawMovies = [];

      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.Response === "True") {
          rawMovies = [...rawMovies, ...result.value.Search];
        }
      });

      // ENRICH DATA
      const enrichedRaw = await fetchDetailedMovies(rawMovies);
      const transformed = enrichedRaw.map(transformMovie);

      // Deduplicate
      const uniqueMovies = Array.from(new Map(transformed.map(m => [m._id, m])).values());

      if (uniqueMovies.length > 0) {
        setMovies(sortMovies(uniqueMovies, sortBy));
        setPage(3);
        setHasMore(true);
      } else {
        setMovies(FALLBACK_MOVIES); // Safe fallbaack
        setHasMore(false);
      }

    } catch (err) {
      console.error("Critical Fetch Error:", err);
      setMovies(FALLBACK_MOVIES);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const type = e.target.value;
    setSortBy(type);
    setMovies(prev => sortMovies(prev, type));
  };

  useEffect(() => {
    // Wrap initial call to prevent race conditions
    let mounted = true;
    if (mounted) {
      fetchInitialMovies();
    }
    return () => { mounted = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies(searchTerm, 1, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(searchTerm, nextPage, true);
  };

  return (
    <div className='relative pt-32 pb-40 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-screen bg-black'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
        <div>
          <h1 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2'>Explore Movies</h1>
          <p className="text-gray-400">Discover new blockbusters and classics</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
        </form>
      </div>

      {/* Movie Grid */}
      {movies.length > 0 ? (
        <>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8'>
            {movies.map((movie, idx) => (
              /* Use index as fallback key because OMDb sometimes returns duplicates */
              <MovieCard movie={movie} key={`${movie._id}-${idx}`} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-16">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-10 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More Movies'}
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
            {error ? (
              <div className="text-center">
                <h1 className='text-sm text-yellow-500 mb-2 font-mono'>{error}</h1>
              </div>
            ) : null}

            {movies.length === 0 && !loading && (
              <h1 className='text-xl'>No movies found for "{searchTerm}"</h1>
            )}
          </div>
        )
      )}

      {loading && movies.length === 0 && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default Movies