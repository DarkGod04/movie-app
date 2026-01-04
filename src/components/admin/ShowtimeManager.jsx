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
            const [{ data: st }, { data: m }, { data: t }] = await Promise.all([
                supabase.from('showtimes')
                    .select('*, movies(title, poster_path), theaters(name)')
                    .gte('show_time', new Date().toISOString())
                    .order('show_time', { ascending: true }),
                supabase.from('movies').select('id, title'),
                supabase.from('theaters').select('id, name')
            ]);

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

            if (error) throw error;
            toast.success("Showtime scheduled!");
            setIsAdding(false);
            fetchData();
        } catch (error) {
            console.error("Error adding showtime:", error);
            toast.error("Failed to schedule showtime");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Cancel this showtime?")) return;
        try {
            const { error } = await supabase.from('showtimes').delete().eq('id', id);
            if (error) throw error;
            toast.success("Showtime cancelled");
            fetchData();
        } catch (error) {
            toast.error("Failed to cancel");
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
                            <select
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                                onChange={e => setFormData({ ...formData, movie_id: e.target.value })}
                            >
                                <option value="">Select Movie</option>
                                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">Theater</label>
                            <select
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                                onChange={e => setFormData({ ...formData, theater_id: e.target.value })}
                            >
                                <option value="">Select Theater</option>
                                {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
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
                    <div className="text-center py-10 text-gray-500">No upcoming showtimes found.</div>
                ) : (
                    showtimes.map(st => (
                        <div key={st.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <img src={st.movies?.poster_path} className="w-12 h-16 object-cover rounded" alt="poster" />
                                <div>
                                    <h4 className="font-bold text-white">{st.movies?.title}</h4>
                                    <div className="flex gap-4 text-xs text-gray-400 mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(st.show_time).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(st.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {st.theaters?.name}</span>
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
