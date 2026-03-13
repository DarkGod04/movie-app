import React, { useEffect, useState } from "react";
import { Heart, PlayCircleIcon, StarIcon, Clock, Globe, Ticket, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { ensureMovieExists, ensureShowtimesForMovie, fetchTheaters, checkIsFavorite, toggleFavorite } from "../lib/db";
import timeFormat from "../assets/lib/timeFormat";
import SEO from "../components/SEO";

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// Fallback data for specific IDs when OMDb fails or limit reached
const FALLBACK_MOVIES = {
  "tt15729350": {
    imdbID: "tt15729350",
    Title: "Teri Baaton Mein Aisa Uljha Jiya",
    Poster: "https://upload.wikimedia.org/wikipedia/en/3/39/Teri_Baaton_Mein_Aisa_Uljha_Jiya_poster.jpg",
    Plot: "A robotics engineer falls in love with an AI robot, leading to comical and emotional chaos.",
    imdbRating: "6.5",
    Released: "09 Feb 2024",
    Runtime: "143 min",
    Genre: "Comedy, Romance, Sci-Fi",
    Director: "Amit Joshi, Aradhana Sah",
    Writer: "Amit Joshi, Aradhana Sah",
    Language: "Hindi"
  },
  "tt22409552": {
    imdbID: "tt22409552",
    Title: "Fighter",
    Poster: "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_poster.jpg",
    Plot: "Top IAF aviators come together in the face of imminent danger, forming Air Dragons, to fight for the nation.",
    imdbRating: "7.0",
    Released: "25 Jan 2024",
    Runtime: "166 min",
    Genre: "Action, Thriller",
    Director: "Siddharth Anand",
    Writer: "Ramon Chibb, Siddharth Anand",
    Language: "Hindi"
  },
  "tt15239678": {
    imdbID: "tt15239678",
    Title: "Dune: Part Two",
    Poster: "https://upload.wikimedia.org/wikipedia/en/4/4a/Dune_Part_Two_poster.jpg",
    Plot: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    imdbRating: "8.8",
    Released: "01 Mar 2024",
    Runtime: "166 min",
    Genre: "Action, Adventure, Drama",
    Director: "Denis Villeneuve",
    Writer: "Denis Villeneuve, Jon Spaihts",
    Language: "English"
  },
  "tt11315808": {
    imdbID: "tt11315808",
    Title: "Civil War",
    Poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Civil_War_%282024_film%29_poster.jpg",
    Plot: "A journey across a dystopian future America, following a team of military-embedded journalists as they race against time to reach DC before rebel factions descend upon the White House.",
    imdbRating: "7.4",
    Released: "12 Apr 2024",
    Runtime: "109 min",
    Genre: "Action, Thriller",
    Director: "Alex Garland",
    Writer: "Alex Garland",
    Language: "English"
  },
  "tt26655182": {
    imdbID: "tt26655182",
    Title: "Shaitaan",
    Poster: "https://upload.wikimedia.org/wikipedia/en/7/7b/Shaitaan_film_poster.jpg",
    Plot: "A timeless tale of battle between good and evil with a family embodying the forces of righteousness while a man symbolizes malevolence.",
    imdbRating: "6.8",
    Released: "08 Mar 2024",
    Runtime: "132 min",
    Genre: "Horror, Thriller",
    Director: "Vikas Bahl",
    Writer: "Aamil Keeyan Khan, Krishnadev Yagnik",
    Language: "Hindi"
  }
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [show, setShow] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [omdbData, setOmdbData] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Generate next 7 days for the date selector
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      fullDate: d.toISOString().split('T')[0]
    };
  });

  const getShow = async () => {
    setIsLoadingInfo(true);
    setNotFound(false);

    // Check locally first for fallback data (instant load + offline support)
    if (FALLBACK_MOVIES[id]) {
      processMovieData(FALLBACK_MOVIES[id]);
      setIsLoadingInfo(false);
      return;
    }

    const url = `https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}&plot=full`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "True") {
        processMovieData(data);
      } else {
        // Double check fallback if not found in API (redundant but safe)
        if (FALLBACK_MOVIES[id]) {
          processMovieData(FALLBACK_MOVIES[id]);
        } else {
          setNotFound(true);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      // Fallback on network error
      if (FALLBACK_MOVIES[id]) {
        processMovieData(FALLBACK_MOVIES[id]);
      } else {
        setNotFound(true);
      }
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const processMovieData = async (data) => {
    setOmdbData(data);

    // 2. Local State Object (for UI)
    const movieData = {
      _id: data.imdbID,
      id: data.imdbID,
      title: data.Title,
      backdrop_path: data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/1920x1080?text=No+Backdrop",
      poster_path: data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x450?text=No+Poster",
      vote_average: data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "7.5", // Default rating
      runtime: parseInt(data.Runtime) || 120, // Default runtime
      release_date: data.Released,
      overview: data.Plot,
      original_language: data.Language ? data.Language.split(',')[0] : "EN",
      genres: data.Genre ? data.Genre.split(',').map((g, i) => ({ id: i, name: g.trim() })) : []
    };

    setShow({ movie: movieData });

    // Check if favorite
    if (user) {
      try {
        const favStatus = await checkIsFavorite(user.id, data.imdbID);
        setIsFavorite(favStatus);
      } catch (e) {
        console.error("Favorite check failed", e);
      }
    }

    // --- BACKEND INTEGRATION SCRIPT ---
    try {
      // A. Ensure Movie exists in DB
      const dbMovieId = await ensureMovieExists(data);

      // B. Get Theaters
      const theaters = await fetchTheaters();

      // C. Get/Generate Showtimes
      const dateStr = dates[selectedDate].fullDate;
      const theaterIds = theaters ? theaters.map(t => t.id) : [];

      if (theaterIds.length > 0) {
        const showtimes = await ensureShowtimesForMovie(dbMovieId, theaterIds, dateStr);
        setShow(prev => ({ ...prev, showtimes, dbMovieId }));
      }
    } catch (dbError) {
      console.error("Supabase Error:", dbError);
    }

    // Fetch Related
    const firstGenre = data.Genre ? data.Genre.split(",")[0].trim() : "Action";
    // Only attempt fetch if key is valid/not limited, otherwise skip or use random?
    // For now we try, if it fails we just don't show related.
    try {
      const relatedRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(firstGenre)}&apikey=${OMDB_API_KEY}&type=movie`);
      const relatedData = await relatedRes.json();
      if (relatedData.Response === "True") {
        const transformedRelated = relatedData.Search
          .filter(m => m.imdbID !== data.imdbID)
          .slice(0, 5)
          .map(m => ({
            id: m.imdbID,
            title: m.Title,
            poster_path: m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450?text=No+Poster",
            release_date: m.Year
          }));
        setRelatedMovies(transformedRelated);
      }
    } catch (e) {
      console.warn("Related movies fetch failed", e);
    }
  };

  useEffect(() => {
    getShow();
  }, [id, selectedDate, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to add to favorites");
      return;
    }
    if (!show?.movie) return;

    try {
      const newStatus = await toggleFavorite(user.id, show.movie);
      setIsFavorite(newStatus);
      toast.success(newStatus ? "Added to Favorites" : "Removed from Favorites");
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message || "Failed to update favorite"}`);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl text-gray-400">Movie not found.</p>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { movie } = show;
  const displayData = omdbData || {};

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white pb-20 overflow-hidden">
      <SEO
        title={movie.title}
        description={`Book tickets for ${movie.title}. ${movie.overview?.slice(0, 150)}...`}
        image={movie.poster_path}
        url={`/movies/${movie.id}`}
      />

      {/* Global Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. Cinematic Hero Header */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] hover:scale-105"
          style={{ backgroundImage: `url(${movie.backdrop_path})` }}
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />

        {/* Content Container */}
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 lg:px-40 pb-20 flex items-end gap-12">
          {/* Poster - Floating Glass Effect */}
          <div className="hidden md:block w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <img
              src={movie.poster_path}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 max-w-4xl">
            {/* Title & Stats */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl leading-[0.9]">
              {movie.title}
            </h1>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-200">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 backdrop-blur-md">
                <StarIcon className="w-4 h-4 fill-current" /> {Number(movie.vote_average).toFixed(1)}
              </span>
              <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">{timeFormat(movie.runtime)}</span>
              <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">{movie.release_date?.split("-")[0]}</span>
              <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full backdrop-blur-md font-bold">
                {omdbData?.Rated || "PG-13"}
              </span>
            </div>

            {/* Plot */}
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl line-clamp-3 md:line-clamp-none font-light drop-shadow-md">
              {displayData.Plot || movie.overview}
            </p>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="px-4 py-1.5 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full text-sm transition-all duration-300 cursor-default">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 mt-8">
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  // Dynamic Price Calculation
                  const baseRating = Number(movie.vote_average) || 7;
                  const isNew = new Date(movie.release_date).getFullYear() > 2022;
                  const standardPrice = Math.floor((baseRating * 30) + (isNew ? 100 : 50));
                  const vipPrice = standardPrice + 150;

                  navigate(`/movies/${movie.id}/${today}`, {
                    state: {
                      movie: {
                        ...movie,
                        prices: { standard: standardPrice, vip: vipPrice }
                      }
                    }
                  });
                }}
                className="group relative px-10 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-3">
                  <Ticket className="w-5 h-5 fill-current" /> Buy Tickets
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toast.success("Opening trailer on YouTube...");
                  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`, "_blank");
                }}
                className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-white font-semibold transition-all hover:border-white/30 flex items-center gap-3"
              >
                <PlayCircleIcon className="w-5 h-5" />
                Watch Trailer
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group hover:border-pink-500/50 ${isFavorite ? 'border-pink-500' : ''}`}
              >
                <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'text-pink-500 fill-current' : 'text-gray-400 group-hover:text-pink-500'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detailed Content Grid */}
      <div className="relative z-10 px-6 md:px-16 lg:px-40 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20">

        {/* --- MAIN COLUMN (Left) --- */}
        <div className="lg:col-span-2 space-y-20">

          {/* SECTION: Storyline */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-10 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
              <h3 className="text-3xl font-bold text-white tracking-tight">Storyline</h3>
            </div>

            <div className="group relative p-8 md:p-10 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-pink-500/20 transition-all duration-500" />

              <p className="relative text-gray-200 text-lg md:text-xl leading-relaxed font-light">
                {displayData.Plot || "No plot synopsis available."}
              </p>

              <div className="relative mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">Director</span>
                  <span className="text-white text-lg font-medium">{displayData.Director || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Writers</span>
                  <span className="text-white text-lg font-medium">{displayData.Writer || "N/A"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: Date Selector (New) */}
          <section id="dateSelect" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-10 bg-gradient-to-b from-pink-500 to-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
              <h3 className="text-3xl font-bold text-white tracking-tight">Choose Date</h3>
            </div>

            <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col gap-10 shadow-2xl overflow-hidden group">
              {/* Decorative Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-pink-500/5 blur-[80px] pointer-events-none" />

              {/* Date Carousel - Centered & Prominent */}
              <div className="w-full flex flex-col items-center gap-6 z-10">
                <div className="text-gray-400 text-sm font-medium uppercase tracking-widest">Select a Date</div>

                <div className="flex items-center justify-center gap-4 w-full">
                  <button
                    onClick={() => {
                      const container = document.getElementById('date-scroll-container');
                      if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                    }}
                    className="hidden md:flex p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div
                    id="date-scroll-container"
                    className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory max-w-3xl"
                  >
                    {dates.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(i)}
                        className={`relative flex flex-col items-center justify-center min-w-[5.5rem] h-24 rounded-2xl border transition-all duration-300 snap-center flex-shrink-0 group/date
                                ${selectedDate === i
                            ? "bg-gradient-to-br from-pink-600 to-purple-700 border-transparent shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-110 z-10"
                            : "bg-white/5 border-white/10 hover:border-pink-500/50 hover:bg-white/10 hover:scale-105"
                          }`}
                      >
                        <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${selectedDate === i ? "text-white" : "text-gray-400 group-hover/date:text-gray-200"}`}>
                          {d.day}
                        </span>
                        <span className={`text-2xl font-black ${selectedDate === i ? "text-white" : "text-white"}`}>
                          {d.date}
                        </span>
                        {i === 0 && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-green-500 text-black px-2 py-0.5 rounded-full whitespace-nowrap">TODAY</span>}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const container = document.getElementById('date-scroll-container');
                      if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                    }}
                    className="hidden md:flex p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Showtimes List - Full Width Below */}
              <div className="w-full border-t border-white/5 pt-8">
                {show?.showtimes && show.showtimes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {/* Group by Theater */}
                    {Object.values(show.showtimes.reduce((acc, curr) => {
                      if (!acc[curr.theaters.id]) acc[curr.theaters.id] = { theater: curr.theaters, times: [] };
                      acc[curr.theaters.id].times.push(curr);
                      return acc;
                    }, {})).map((group, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors">

                        {/* Theater Info */}
                        <div className="md:w-1/3 flex flex-col justify-center">
                          <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-pink-500" />
                            {group.theater.name}
                          </h4>
                          <p className="text-sm text-gray-400 pl-7">{group.theater.location || "City Center"}</p>
                          <div className="flex gap-3 mt-4 pl-7">
                            <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">Dolby Atmos</span>
                            <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">Recliners</span>
                          </div>
                        </div>

                        {/* Times Grid */}
                        <div className="md:w-2/3 flex flex-wrap items-center gap-3">
                          {group.times.map((t) => {
                            const dateObj = new Date(t.show_time);
                            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                              <button
                                key={t.id}
                                onClick={() => {
                                  navigate(`/movies/${movie.id}/${dates[selectedDate].fullDate}`, {
                                    state: {
                                      movie: { ...movie },
                                      showtime: t,
                                      date: dates[selectedDate].fullDate
                                    }
                                  });
                                }}
                                className="group/time relative px-6 py-3 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 border border-white/10 hover:border-transparent transition-all overflow-hidden"
                              >
                                <span className="relative z-10 text-base font-bold text-white tracking-wider">{timeStr}</span>
                                <div className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover/time:opacity-100 transition-opacity" />
                              </button>
                            )
                          })}
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-300">No shows available</h4>
                      <p className="text-gray-500 text-sm">Please select another date or check back later.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION: Top Cast */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
              <h3 className="text-3xl font-bold text-white tracking-tight">Leading Cast</h3>
            </div>

            {isLoadingInfo ? (
              <div className="animate-pulse flex gap-4">
                <div className="w-32 h-40 bg-gray-800 rounded-xl"></div>
                <div className="w-32 h-40 bg-gray-800 rounded-xl"></div>
                <div className="w-32 h-40 bg-gray-800 rounded-xl"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {displayData.Actors && displayData.Actors !== "N/A" ? (
                  displayData.Actors.split(', ').map((actor, idx) => (
                    <div key={idx} className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-6 rounded-2xl flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      {/* CastAvatar Removed as dependency needed, using simple placeholder or text */}
                      <div className="relative w-24 h-24 rounded-full p-1 border-2 border-white/10 group-hover:border-pink-500 transition-colors shadow-xl overflow-hidden bg-gray-700">
                        {/* Placeholder for CastAvatar since component path is unsure/removed in previous steps? No, it should be there. Restoring simple img tag if avatar logic is complex */}
                        <img src={`https://ui-avatars.com/api/?name=${actor}&background=random`} alt={actor} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-white text-base group-hover:text-pink-200 transition-colors">{actor}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Cast</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Cast information unavailable.</p>
                )}
              </div>
            )}
          </section>

          {/* SECTION: Similar Movies */}
          {relatedMovies.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                <h3 className="text-3xl font-bold text-white tracking-tight">More Like This</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {relatedMovies.map((m, idx) => (
                  <a href={`/movies/${m.id}`} key={idx} className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                    <img src={m.poster_path} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-0 left-0 p-5 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-white font-bold text-lg leading-tight mb-1">{m.title}</h4>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{m.release_date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* --- SIDEBAR (Right) --- */}
        <div className="space-y-10">

          {/* WIDGET: Ratings */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-lg">
            <h4 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
              <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
              Critical Reception
            </h4>
            <div className="space-y-6">
              {displayData.Ratings?.map((rating, idx) => {
                let color = "bg-gray-600";
                let shadow = "shadow-none";
                if (rating.Source === "Internet Movie Database") { color = "bg-yellow-400"; shadow = "shadow-[0_0_10px_rgba(250,204,21,0.5)]"; }
                if (rating.Source === "Rotten Tomatoes") { color = "bg-red-500"; shadow = "shadow-[0_0_10px_rgba(239,68,68,0.5)]"; }
                if (rating.Source === "Metacritic") { color = "bg-green-500"; shadow = "shadow-[0_0_10px_rgba(34,197,94,0.5)]"; }

                // Parse percentage for width
                let width = "50%";
                if (rating.Value.includes("%")) width = rating.Value;
                else if (rating.Value.includes("/")) {
                  const [num, den] = rating.Value.split("/");
                  width = `${(Number(num) / Number(den)) * 100}%`;
                }

                return (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{rating.Source}</span>
                      <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded">{rating.Value}</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-800/50 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${color} ${shadow} rounded-full transition-all duration-1000 ease-out`} style={{ width: width }}></div>
                    </div>
                  </div>
                )
              })}
              {!displayData.Ratings?.length && <p className="text-sm text-gray-500 italic">No ratings available.</p>}
            </div>
          </div>

          {/* WIDGET: Technical Specs */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-lg">
            <h4 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-400" />
              Technical Specs
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-400 font-medium">Released</span>
                <span className="text-white font-semibold">{displayData.Released || "N/A"}</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-400 font-medium">DVD Release</span>
                <span className="text-white font-semibold">{displayData.DVD || "N/A"}</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-400 font-medium">Box Office</span>
                <span className="text-white font-semibold text-green-400">{displayData.BoxOffice || "N/A"}</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-400 font-medium">Country</span>
                <span className="text-white font-semibold text-right max-w-[150px] truncate">{displayData.Country || "N/A"}</span>
              </li>
              <li className="flex justify-between items-center pt-1">
                <span className="text-gray-400 font-medium">Metascore</span>
                <span className={`font-bold px-3 py-1 rounded-md text-xs border ${Number(displayData.Metascore) > 60 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                  {displayData.Metascore || "N/A"}
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};

export default MovieDetail;
