import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Film, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchMovies } from '../lib/db';
import { useNavigate } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Slight delay to allow animation to start
            setTimeout(() => inputRef.current.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length === 0) {
                setResults([]);
                return;
            }
            setLoading(true);
            const data = await searchMovies(query);
            setResults(data);
            setLoading(false);
        };

        const timeoutId = setTimeout(fetchResults, 300); // 300ms debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleNavigate = (id) => {
        onClose();
        navigate(`/movies/${id}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex flex-col items-center pt-24 px-4 font-['Outfit']"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/5"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Search Input */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full max-w-3xl relative"
                    >
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for movies, genres..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-20 pr-6 py-6 text-2xl md:text-4xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all font-bold shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        />
                    </motion.div>

                    {/* Results Area */}
                    <div className="w-full max-w-5xl mt-12 overflow-y-auto max-h-[70vh] pb-20 scrollbar-hide">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {results.map((movie, index) => (
                                    <motion.div
                                        key={movie.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleNavigate(movie.id)}
                                        className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-[#1a1a1a] border border-white/5 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all"
                                    >
                                        <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-0 left-0 p-4 w-full">
                                            <h4 className="text-white font-bold leading-tight truncate">{movie.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{movie.genres?.[0] || 'Movie'}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : query.length > 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <Film className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-xl font-medium">No movies found for "{query}"</p>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-600">
                                <p className="text-lg">Start typing to search...</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
