import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Calendar, Clock, MapPin, Plus, Trash2, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ShowtimeManager = () => {
    const [loading, setLoading] = useState(true);
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        movie_id: '',
        theater_id: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        price_standard: 200,
        price_vip: 350
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log("Fetching showtime data...");
            const [{ data: st, error: stError }, { data: m, error: mError }, { data: t, error: tError }] = await Promise.all([
                supabase.from('showtimes')
                    .select('*, movies(title, poster_path), theaters(name)')
                    .gte('show_time', new Date().toISOString())
                    .order('show_time', { ascending: true }),
                supabase.from('movies').select('id, title'),
                supabase.from('theaters').select('id, name')
            ]);

            if (stError) console.error("Showtimes Error:", stError);
            if (mError) console.error("Movies Error:", mError);
            if (tError) console.error("Theaters Error:", tError);

            console.log("Movies fetched:", m);
            console.log("Theaters fetched:", t);

            if (st) setShowtimes(st);
            if (m) setMovies(m);
            if (t) setTheaters(t);
        } catch (error) {
            console.error("Error fetching showtime data:", error);
            toast.error("Failed to load showtimes");
        } finally {
            setLoading(false);
        }
    };

    const handleAddShowtime = async (e) => {
        e.preventDefault();

        if (!formData.movie_id || !formData.theater_id) {
            toast.error("Please select both a movie and a theater");
            return;
        }

        try {
            const show_time = new Date(`${formData.date}T${formData.time}`).toISOString();

            const { error } = await supabase.from('showtimes').insert({
                movie_id: formData.movie_id,
                theater_id: formData.theater_id,
                show_time: show_time,
                screen_number: `Screen ${Math.floor(Math.random() * 5) + 1}`, // Random screen for now
                price_standard: parseInt(formData.price_standard),
                price_vip: parseInt(formData.price_vip)
            });

            if (error) {
                console.error("Supabase Insert Error:", error);
                throw error;
            }
            toast.success("Showtime scheduled!");
            setIsAdding(false);
            fetchData();
        } catch (error) {
            console.error("Error adding showtime (Full):", error);
            toast.error(`Failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this showtime?")) return;

        try {
            const { error } = await supabase.from('showtimes').delete().eq('id', id);

            if (error) {
                console.error("Delete Error:", error);
                throw error;
            }

            toast.success("Showtime deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Failed to delete:", error);
            toast.error(`Failed to delete: ${error.message}`);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#1a1a1a]/40 p-6 rounded-2xl border border-white/5">
                <div>
                    <h3 className="text-xl font-bold text-white">Upcoming Showtimes</h3>
                    <p className="text-sm text-gray-400">Manage scheduler for all theaters</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isAdding ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Schedule</>}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddShowtime} className="bg-[#1a1a1a] p-6 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] space-y-4 animate-in slide-in-from-top-4 fade-in">
                    <h4 className="font-bold text-purple-400 uppercase text-xs tracking-wider mb-2">New Showtime Details</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">Movie</label>
                            <CustomDropdown
                                options={movies}
                                value={formData.movie_id}
                                onChange={(val) => setFormData({ ...formData, movie_id: val })}
                                placeholder="Select Movie"
                                labelKey="title"
                                valueKey="id"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">Theater</label>
                            <CustomDropdown
                                options={theaters}
                                value={formData.theater_id}
                                onChange={(val) => setFormData({ ...formData, theater_id: val })}
                                placeholder="Select Theater"
                                labelKey="name"
                                valueKey="id"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">Date</label>
                            <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                                value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">Time</label>
                            <input type="time" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                                value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">Standard (₹)</label>
                            <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                                value={formData.price_standard} onChange={e => setFormData({ ...formData, price_standard: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">VIP (₹)</label>
                            <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                                value={formData.price_vip} onChange={e => setFormData({ ...formData, price_vip: e.target.value })} />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Save Schedule
                    </button>
                </form>
            )}

            <div className="grid gap-4">
                {showtimes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/5 border-dashed rounded-3xl group hover:bg-white/10 transition-colors">
                        <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                            <Calendar className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Showtimes</h3>
                        <p className="text-gray-400 max-w-sm text-center mb-8">
                            Your schedule is currently empty. Start adding showtimes to sell tickets.
                        </p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Schedule a Movie
                        </button>
                    </div>
                ) : (
                    showtimes.map(st => (
                        <div key={st.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <img src={st.movies?.poster_path} className="w-16 h-24 object-cover rounded-lg shadow-lg" alt="poster" />
                                <div>
                                    <h4 className="font-bold text-lg text-white mb-1">{st.movies?.title}</h4>

                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-2">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-purple-400" /> {new Date(st.show_time).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> {new Date(st.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-pink-400" /> {st.theaters?.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono text-gray-300 border border-white/5">
                                            {st.screen_number || 'Screen 1'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                            ₹{st.price_standard}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                                            VIP: ₹{st.price_vip}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(st.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ShowtimeManager;

const CustomDropdown = ({ options, value, onChange, placeholder, labelKey, valueKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt[valueKey] === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 text-left flex justify-between items-center"
            >
                <span className={selectedOption ? 'text-white' : 'text-gray-500'}>
                    {selectedOption ? selectedOption[labelKey] : placeholder}
                </span>
                <span className="text-gray-500 text-xs">▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl max-h-60 overflow-y-auto">
                    {options.length > 0 ? (
                        options.map(opt => (
                            <div
                                key={opt[valueKey]}
                                onClick={() => {
                                    onChange(opt[valueKey]);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-3 hover:bg-purple-600/20 hover:text-purple-400 cursor-pointer text-white border-b border-white/5 last:border-none transition-colors"
                            >
                                {opt[labelKey]}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">No options found</div>
                    )}
                </div>
            )}

            {/* Backdrop to close */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
};
