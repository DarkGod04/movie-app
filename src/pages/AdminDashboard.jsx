import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurCircle from '../components/BlurCircle';
import { LayoutDashboard, Film, Calendar, Users, Plus, DollarSign, TrendingUp, Search, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AddMovieForm from '../components/admin/AddMovieForm';
import ShowtimeManager from '../components/admin/ShowtimeManager';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // State
    const [stats, setStats] = useState({
        revenue: 0,
        bookings: 0,
        movies: 0,
        users: 0
    });
    const [movies, setMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [showAddMovie, setShowAddMovie] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        fetchStats();
        if (activeTab === 'movies') {
            fetchMovies();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            // Rough stats calculation
            const { count: bookingCount, data: bookingData } = await supabase.from('bookings').select('total_price', { count: 'exact' });
            const totalRevenue = bookingData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

            const { count: movieCount } = await supabase.from('movies').select('id', { count: 'exact', head: true });

            setStats({
                revenue: totalRevenue,
                bookings: bookingCount || 0,
                movies: movieCount || 0,
                users: 342 // Mock for now
            });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMovies = async () => {
        setLoadingMovies(true);
        const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
        if (data) setMovies(data);
        setLoadingMovies(false);
    };

    const handleDeleteMovie = async (id) => {
        if (!window.confirm("Are you sure? This will delete all showtimes for this movie too.")) return;

        try {
            const { error } = await supabase.from('movies').delete().eq('id', id);
            if (error) throw error;
            toast.success("Movie deleted");
            fetchMovies(); // Refresh
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete movie");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-['Outfit']">
            <BlurCircle top="-10%" left="-10%" />
            <BlurCircle bottom="-10%" right="-10%" />

            {/* Modals */}
            <AnimatePresence>
                {showAddMovie && (
                    <AddMovieForm
                        onClose={() => setShowAddMovie(false)}
                        onMovieAdded={(newMovie) => {
                            setMovies([newMovie, ...movies]);
                            setStats(prev => ({ ...prev, movies: prev.movies + 1 }));
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="flex h-screen pt-20 relative z-10">
                {/* Sidebar */}
                <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl hidden md:flex flex-col p-6 gap-2">
                    <div className="mb-8 px-2">
                        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Admin <span className="text-white">Panel</span>
                        </h2>
                        <p className="text-xs text-gray-400 font-mono mt-1">v2.0.0 • QuickShow</p>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                            { id: 'movies', label: 'Movies', icon: Film },
                            { id: 'showtimes', label: 'Showtimes', icon: Calendar },
                            { id: 'users', label: 'Users', icon: Users },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === item.id
                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-purple-400' : ''}`} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors px-4 py-2 w-full text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Operational
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Dashboard {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                            <p className="text-gray-400 text-sm">Welcome back, Administrator.</p>
                        </div>

                        <div className="flex gap-4">
                            {activeTab === 'movies' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAddMovie(true)}
                                    className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Movie
                                </motion.button>
                            )}
                        </div>
                    </header>

                    {/* DYNAMIC CONTENT AREA */}
                    <div className="space-y-8">

                        {/* OVERVIEW STATS */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-[#1a1a1a]/60 border border-white/5 backdrop-blur-md relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 rounded-bl-3xl bg-green-400/10 text-green-400 opacity-20 group-hover:opacity-100 transition-opacity"><DollarSign className="w-6 h-6" /></div>
                                        <p className="text-gray-400 font-medium text-sm mb-1">Total Revenue</p>
                                        <h3 className="text-3xl font-bold text-green-400">₹{stats.revenue.toLocaleString()}</h3>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl bg-[#1a1a1a]/60 border border-white/5 backdrop-blur-md relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 rounded-bl-3xl bg-blue-400/10 text-blue-400 opacity-20 group-hover:opacity-100 transition-opacity"><TrendingUp className="w-6 h-6" /></div>
                                        <p className="text-gray-400 font-medium text-sm mb-1">Total Bookings</p>
                                        <h3 className="text-3xl font-bold text-blue-400">{stats.bookings}</h3>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-3xl bg-[#1a1a1a]/60 border border-white/5 backdrop-blur-md relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 rounded-bl-3xl bg-purple-400/10 text-purple-400 opacity-20 group-hover:opacity-100 transition-opacity"><Film className="w-6 h-6" /></div>
                                        <p className="text-gray-400 font-medium text-sm mb-1">Active Movies</p>
                                        <h3 className="text-3xl font-bold text-purple-400">{stats.movies}</h3>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-3xl bg-[#1a1a1a]/60 border border-white/5 backdrop-blur-md relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 rounded-bl-3xl bg-pink-400/10 text-pink-400 opacity-20 group-hover:opacity-100 transition-opacity"><Users className="w-6 h-6" /></div>
                                        <p className="text-gray-400 font-medium text-sm mb-1">Registered Users</p>
                                        <h3 className="text-3xl font-bold text-pink-400">{stats.users}</h3>
                                    </motion.div>
                                </div>
                            </>
                        )}

                        {/* MOVIES LIST */}
                        {activeTab === 'movies' && (
                            <div className="grid grid-cols-1 gap-4">
                                {loadingMovies ? (
                                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
                                ) : movies.length > 0 ? (
                                    movies.map((movie) => (
                                        <div key={movie.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                                            <img src={movie.poster_path} alt={movie.title} className="w-16 h-24 object-cover rounded-lg bg-black/40" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-white">{movie.title}</h4>
                                                <div className="flex gap-2 text-sm text-gray-400 mt-1">
                                                    <span className="px-2 py-0.5 bg-white/10 rounded text-xs">{movie.runtime}m</span>
                                                    {movie.genres && typeof movie.genres === 'object' && Array.isArray(movie.genres)
                                                        ? movie.genres.join(', ')
                                                        : movie.genres}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDeleteMovie(movie.id)}
                                                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                                                    title="Delete Movie"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 rounded-3xl bg-[#1a1a1a]/40 border border-white/5 border-dashed flex flex-col items-center justify-center text-center py-20">
                                        <Film className="w-16 h-16 text-gray-700 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-300">No Movies Found</h3>
                                        <p className="text-gray-500 max-w-sm mt-2">Start building your cinema database by adding your first movie.</p>
                                        <button onClick={() => setShowAddMovie(true)} className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold border border-white/10 transition-all">
                                            Import from OMDb
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SHOWTIMES MANAGER */}
                        {activeTab === 'showtimes' && <ShowtimeManager />}

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
