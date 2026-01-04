import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MovieCard from "./MovieCard";

const OMDB_API_KEY = "1e43b127";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetching "Marvel" movies without year restriction to get more candidates
        const res = await fetch(`https://www.omdbapi.com/?s=Marvel&apikey=${OMDB_API_KEY}&type=movie`);
        const data = await res.json();

        if (data.Response === "True") {
          // Process concurrently but wait for results to filter effectively
          // We fetch details for all candidates (up to 10) to ensure we have enough valid ones after filtering
          const candidates = data.Search || [];

          const detailedPromises = candidates.map(async (m) => {
            const detailRes = await fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${OMDB_API_KEY}`);
            const detail = await detailRes.json();
            return {
              _id: m.imdbID,
              id: m.imdbID,
              title: m.Title,
              poster_path: m.Poster, // Keep raw poster for filtering check
              vote_average: detail.imdbRating,
              release_date: m.Year,
              runtime: detail.Runtime !== "N/A" ? detail.Runtime.split(" ")[0] : null,
              genres: detail.Genre ? detail.Genre.split(", ").map(g => ({ name: g })) : []
            };
          });

          const allDetails = await Promise.all(detailedPromises);

          // Robust Filtering:
          // 1. Must have a valid Poster (not "N/A")
          // 2. Must not be "Untitled"
          // 3. Must have a valid numeric rating (not "N/A")
          const validMovies = allDetails.filter(m =>
            m.poster_path !== "N/A" &&
            !m.title.toLowerCase().includes("untitled") &&
            m.vote_average !== "N/A"
          );

          // Final cleanup for display and limit to 4-5 items
          const finalMovies = validMovies.slice(0, 5).map(m => ({
            ...m,
            poster_path: m.poster_path // It's already valid per filter
          }));

          setMovies(finalMovies);
        }
      } catch (err) {
        console.error("Failed to fetch featured movies:", err);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-36 overflow-hidden bg-black pb-20">
      {/* Ambient Background */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between pt-20 pb-12 z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-gradient-to-b from-pink-600 to-purple-600 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">Now Showing</p>
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mt-1">Latest Releases</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-pink-400 transition-all cursor-pointer px-4 py-2 border border-transparent hover:border-white/10 rounded-full hover:bg-white/5"
        >
          View All
          <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
        </button>
      </div>

      {/* Movies Grid */}
      <div className="flex flex-wrap justify-start gap-8 mt-8">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))
        ) : (
          /* Loading Skeleton */
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-64 h-96 bg-white/5 rounded-2xl animate-pulse"></div>
          ))
        )}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="px-12 py-3 text-sm bg-transparent border border-gray-700 hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-400 text-gray-300 transition-all rounded-full font-medium tracking-wide"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
