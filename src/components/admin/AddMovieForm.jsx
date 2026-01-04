import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Search, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

const AddMovieForm = ({ onClose, onMovieAdded }) => {
    const [loading, setLoading] = useState(false);
    const [omdbLoading, setOmdbLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        omdb_id: '',
        poster_path: '',
        genres: '',
        runtime: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Auto-fill from OMDb
    const handleFetchOMDb = async () => {
        if (!formData.omdb_id) return;
        setOmdbLoading(true);
        try {
            const res = await fetch(`https://www.omdbapi.com/?i=${formData.omdb_id}&apikey=1e43b127`);
            const data = await res.json();

            if (data.Response === 'True') {
                setFormData({
                    title: data.Title,
                    omdb_id: data.imdbID,
                    poster_path: data.Poster !== 'N/A' ? data.Poster : '',
                    genres: data.Genre,
                    runtime: parseInt(data.Runtime) || 0
                });
                toast.success("Data fetched from OMDb!");
            } else {
                toast.error(data.Error || "Movie not found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch from OMDb");
        } finally {
            setOmdbLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('movies')
                .insert({
                    title: formData.title,
                    omdb_id: formData.omdb_id || `custom-${Date.now()}`,
                    poster_path: formData.poster_path,
                    backdrop_path: formData.poster_path, // Fallback
                    genres: formData.genres.split(',').map(g => g.trim()),
                    runtime: parseInt(formData.runtime) || 0
                })
                .select()
                .single();

            if (error) throw error;

            toast.success(`${formData.title} added successfully!`);
            onMovieAdded(data);
            onClose();
        } catch (error) {
            console.error("Error adding movie:", error);
            toast.error("Failed to add movie. Title might be duplicate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Film className="w-5 h-5 text-pink-500" />
                        Add New Movie
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* OMDb Auto-Fill Search */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="omdb_id"
                            value={formData.omdb_id}
                            onChange={handleChange}
                            placeholder="Enter IMDb ID (e.g. tt1234567) to auto-fill"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none font-mono text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleFetchOMDb}
                            disabled={omdbLoading || !formData.omdb_id}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {omdbLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="w-full h-px bg-white/5 my-2" />

                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Movie Title</label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                            placeholder="The Matrix"
                        />
                    </div>

                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Poster URL</label>
                        <div className="flex gap-4">
                            <input
                                required
                                type="url"
                                name="poster_path"
                                value={formData.poster_path}
                                onChange={handleChange}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                placeholder="https://..."
                            />
                            {formData.poster_path && (
                                <img src={formData.poster_path} alt="Preview" className="w-12 h-16 object-cover rounded bg-white/5" />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Genres (comma sep)</label>
                            <input
                                required
                                type="text"
                                name="genres"
                                value={formData.genres}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                placeholder="Action, Sci-Fi"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Runtime (mins)</label>
                            <input
                                required
                                type="number"
                                name="runtime"
                                value={formData.runtime}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                placeholder="120"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            {loading ? "Adding..." : "Add Movie to Database"}
                        </button>
                    </div>

                </form>
            </motion.div>
        </motion.div>
    );
};
import { Plus } from 'lucide-react';

export default AddMovieForm;
