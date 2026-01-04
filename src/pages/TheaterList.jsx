
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Film, Star, RefreshCw } from 'lucide-react';
import { fetchTheaters, seedTheaters } from '../lib/db';
import { useNavigate } from 'react-router-dom';

const TheaterList = () => {
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            // 1. Try to fetch theaters
            let data = await fetchTheaters();

            // 2. If empty, auto-seed
            if (!data || data.length === 0) {
                console.log("No theaters found, attempting to seed...");
                setSeeding(true);
                try {
                    await seedTheaters();
                    // Short delay to ensure propagation
                    await new Promise(r => setTimeout(r, 1000));
                    data = await fetchTheaters();
                } catch (seedErr) {
                    console.error("Seeding error:", seedErr);
                    // Don't fail completely, just show empty or error
                    setErrorMsg("Could not auto-seed theaters. Please check database connection.");
                } finally {
                    setSeeding(false);
                }
            }

            setTheaters(data || []);
        } catch (err) {
            console.error("Error loading theaters:", err);
            setErrorMsg(err.message || "Failed to load theaters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-16 lg:px-40 pb-20">
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                        Theaters <span className="text-pink-600">Near You</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Experience movies in the best quality at our premium locations.
                        Select a theater to see what's playing.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl mb-8">
                    <h3 className="text-red-500 font-bold mb-2">Error Loading Data</h3>
                    <p className="text-gray-300 font-mono text-xs">{errorMsg}</p>
                </div>
            )}

            {loading || seeding ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="w-full h-80 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {theaters.map((theater, idx) => (
                        <TheaterCard key={theater.id} theater={theater} index={idx} navigate={navigate} />
                    ))}

                    {theaters.length === 0 && !errorMsg && (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-2xl text-gray-500 font-bold">No theaters found.</p>
                            <p className="text-gray-400 mt-2">Try refreshing to load our partner theaters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TheaterCard = ({ theater, index, navigate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-[#0a0a0a] border border-white/5 hover:border-pink-500/30 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(236,72,153,0.15)] flex flex-col h-full"
        >
            {/* Header Image Area */}
            <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 z-0 group-hover:scale-110 transition-transform duration-700" />

                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-black to-black" />

                <div className="absolute bottom-4 left-6 z-20">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-pink-600/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">Premium</span>
                        {theater.facilities?.slice(0, 2).map(f => (
                            <span key={f} className="px-2 py-0.5 bg-white/10 text-gray-300 text-[10px] uppercase tracking-wider rounded-full backdrop-blur-md">{f}</span>
                        ))}
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight group-hover:text-pink-500 transition-colors">{theater.name}</h3>
                </div>
            </div>

            <div className="p-6 pt-2 flex-grow flex flex-col">
                <div className="flex items-start gap-2.5 text-gray-400 mb-6 min-h-[40px]">
                    <MapPin className="w-4 h-4 mt-1 text-pink-600 shrink-0" />
                    <span className="text-sm font-medium leading-relaxed opacity-80">{theater.location}</span>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Features</span>
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-white">4.8</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/movies')}
                            className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                        >
                            View Movies
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default TheaterList;
