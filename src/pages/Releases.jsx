import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket, StarIcon, ChevronRight, PlayCircle, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';

const OMDB_API_KEY = "1e43b127";

// --- Fallback Data for when API Limit is Reached ---
const FALLBACK_HOLLYWOOD = [
    { imdbID: "tt15239678", Title: "Dune: Part Two", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt11315808", Title: "Civil War", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BYTYyODhlODktYjUzNC00NjUyLWI1MzEtYzY2MGJhYWE5YjQ3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt14539740", Title: "Godzilla x Kong: The New Empire", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BYWM0MDI1ZmItZTYyNjY2MWJkLTk2ZDYtMjQ0OTMzMmM4M2RjXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt12037194", Title: "Furiosa: A Mad Max Saga", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BNzRiMjg0MzUtNTNhMC00YWQyLWEyY2ItMzQzNDc2ZDMxNjliXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt1684562", Title: "The Fall Guy", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BMjMwMTAzODMtNzQ4ZC00ZGUwLWIwYjQtYjg3M2Q2ODczMzQ2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt1160419", Title: "Kingdom of the Planet of the Apes", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BNDUyNWE5NDQtZTQxYy00NDg0LTljMWEtMWM4ZGYxMGVkMDlhXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg", Type: "movie" }
];

const FALLBACK_BOLLYWOOD = [
    { imdbID: "tt22409552", Title: "Fighter", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BNzY2IzU2NjctZDc2ZC00MmY1LWJiYjktMTk5ZjEzYjA0ZDAyXkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt26655182", Title: "Shaitaan", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BNzRiZTRhZGMtYjFlNS00Y2FkLWE4MjktYmQ0ZTZhNjE3NjExXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt14992822", Title: "Crew", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BM2QzM2VjOGQtMzhiMy00OGFkLTg4YzAtN2EyYWY1MTcwNTI5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt9663764", Title: "Bade Miyan Chote Miyan", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BYzA0NTY4MjctNTkzNS00ZjAwLTg3YTctY2I1MzExYTQ4NDJhXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt10839218", Title: "Maidaan", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BYmQ0ZmVjNmYtNGUzZS00NmRiLWI5NTgtYTYxOWVkZMzVkYTJiXkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_SX300.jpg", Type: "movie" },
    { imdbID: "tt15729350", Title: "Teri Baaton Mein Aisa Uljha Jiya", Year: "2024", Poster: "https://m.media-amazon.com/images/M/MV5BMjA2M2Y5NzQtOTIwYy00YmI1LWI2MTctMmI2M2Q1OGJlMzQzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg", Type: "movie" }
];

const ReleaseSection = ({ title, movies, loading, navigate }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth / 1.5 : current.offsetWidth / 1.5;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!loading && movies.length === 0) return null;

    return (
        <div className="mb-16 relative">
            <div className="flex items-center justify-between mb-6 px-6 md:px-16 lg:px-40">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                    {title}
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-2 px-6 md:px-16 lg:px-40 no-scrollbar snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="min-w-[200px] md:min-w-[240px] aspect-[2/3] bg-white/5 rounded-2xl animate-pulse flex-shrink-0" />
                    ))
                ) : (
                    movies.map((movie, idx) => (
                        <ReleaseCard key={movie.imdbID || idx} movie={movie} navigate={navigate} />
                    ))
                )}
            </div>
        </div>
    );
};

const ReleaseCard = ({ movie, navigate }) => {
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative min-w-[200px] md:min-w-[240px] aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-[#1a1a1a] snap-center flex-shrink-0 border border-white/5 hover:border-pink-500/30 shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
            onClick={() => navigate(`/movies/${movie.imdbID}`)}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10" />

            {movie.Poster !== "N/A" ? (
                <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500">
                    <StarIcon className="w-12 h-12 mb-2" />
                    <span className="text-xs uppercase font-bold">No Poster</span>
                </div>
            )}

            <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                <span className="text-xs font-bold text-white tracking-wider">{movie.Year}</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-1 group-hover:text-pink-500 transition-colors">
                    {movie.Title}
                </h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <span className="text-xs text-gray-300 capitalize">{movie.Type}</span>
                    <button className="flex items-center gap-1 text-xs font-bold text-pink-500 bg-pink-500/10 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-pink-500 hover:text-white transition-all">
                        Details <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Releases = () => {
    const navigate = useNavigate();
    const [hollywood, setHollywood] = useState([]);
    const [bollywood, setBollywood] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    const fetchMovies = async (query, year) => {
        try {
            const res = await fetch(`https://www.omdbapi.com/?s=${query}&y=${year}&type=movie&apikey=${OMDB_API_KEY}`);
            const data = await res.json();
            if (data.Response === "True") {
                return data.Search;
            }
            if (data.Error === "Request limit reached!") {
                setApiError(true);
            }
            return [];
        } catch (error) {
            console.error("Error fetching movies:", error);
            return [];
        }
    };

    useEffect(() => {
        const loadAllReleases = async () => {
            setLoading(true);
            const currentYear = new Date().getFullYear();
            const lastYear = currentYear - 1;

            // Use Fallbacks if API Key is exhausted (simulate check or just try-catch loop)
            // Strategy: Try fetching. If empty or error, use fallback.

            // 1. Hollywood
            let hw = await fetchMovies("action", lastYear);
            if (hw.length === 0) hw = await fetchMovies("adventure", lastYear);

            // 2. Bollywood
            let bw = await fetchMovies("hindi", currentYear);
            if (bw.length === 0) bw = await fetchMovies("bollywood", lastYear);

            // 3. New Releases (General)
            let nr = await fetchMovies("movie", currentYear);

            // Deduplicate
            const uniqueMovies = (arr) => {
                const unique = new Map();
                arr.forEach(item => {
                    if (item && item.imdbID) unique.set(item.imdbID, item);
                });
                return Array.from(unique.values());
            };

            const finalHw = uniqueMovies(hw);
            const finalBw = uniqueMovies(bw);
            const finalNr = uniqueMovies(nr);

            // Fallback Logic
            if (finalHw.length === 0) setHollywood(FALLBACK_HOLLYWOOD);
            else setHollywood(finalHw);

            if (finalBw.length === 0) setBollywood(FALLBACK_BOLLYWOOD);
            else setBollywood(finalBw);

            if (finalNr.length === 0) setNewReleases([...FALLBACK_HOLLYWOOD, ...FALLBACK_BOLLYWOOD]);
            else setNewReleases(finalNr);

            setLoading(false);
        };

        loadAllReleases();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            <BlurCircle top="-10%" left="-10%" />
            <BlurCircle bottom="10%" right="-5%" color="rgba(236, 72, 153, 0.15)" />

            {/* Header */}
            <div className="px-6 md:px-16 lg:px-40 mb-16 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <Rocket className="w-8 h-8 text-pink-500 animate-bounce" />
                    <span className="text-pink-500 font-bold uppercase tracking-[0.2em] text-sm">Now Trending</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                    New <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Releases</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                    Explore the latest blockbusters from Hollywood, Bollywood, and beyond.
                    Stay updated with what's fresh in theaters and on streaming.
                </p>
                {apiError && (
                    <div className="mt-4 flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg max-w-md border border-yellow-500/20">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">API Limit Reached. Showing curated fallback list.</span>
                    </div>
                )}
            </div>

            {/* Sections */}
            <div className="relative z-10">
                <ReleaseSection title="Hollywood Hits" movies={hollywood} loading={loading} navigate={navigate} />
                <ReleaseSection title="Bollywood Blockbusters" movies={bollywood} loading={loading} navigate={navigate} />
                <ReleaseSection title="All New Arrivals" movies={newReleases} loading={loading} navigate={navigate} />
            </div>

            {/* No Results State (Should be rare now with fallbacks) */}
            {!loading && hollywood.length === 0 && bollywood.length === 0 && newReleases.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                    <StarIcon className="w-16 h-16 text-gray-500 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Releases Found</h3>
                    <p className="text-gray-400 max-w-md">Try checking back later for more updates.</p>
                </div>
            )}
        </div>
    );
};

export default Releases;
