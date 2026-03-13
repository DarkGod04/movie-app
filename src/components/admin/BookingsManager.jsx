import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Calendar, Clock, MapPin, Ticket, User, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    showtimes (
                        show_time,
                        screen_number,
                        theaters (name, location),
                        movies (title, poster_path, runtime)
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const movieTitle = b.showtimes?.movies?.title || b.movie_title || '';
        return movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.toString().includes(searchTerm)
    });

    if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading bookings...</div>;

    return (
        <div className="space-y-6">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Ticket className="text-pink-500" /> All Bookings
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">View and manage customer reservations</p>
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by movie, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No bookings found</h3>
                        <p className="text-gray-500">There are no bookings matching your search.</p>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))
                )}
            </div>
        </div>
    );
};

const BookingCard = ({ booking }) => {
    const [expanded, setExpanded] = useState(false);

    // Parse seats if it's a string, otherwise use as is
    let seats = [];
    try {
        seats = typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats;
    } catch (_e) { // Ignore parsing errors
        seats = booking.seats || [];
    }

    const movie = booking.showtimes?.movies || {};
    const theater = booking.showtimes?.theaters || {};
    const showtime = booking.showtimes || {};

    // Format date properly
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
            <div className="p-6 flex flex-col md:flex-row justify-between gap-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>

                {/* Movie Info */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-24 bg-black/40 rounded-lg flex items-center justify-center border border-white/5 overflow-hidden">
                        {(movie.poster_path || booking.poster_path) ? (
                            <img src={movie.poster_path || booking.poster_path} alt={movie.title || booking.movie_title} className="w-full h-full object-cover" />
                        ) : (
                            <Ticket className="text-gray-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white mb-1">{movie.title || booking.movie_title || 'Unknown Movie'}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {booking.status?.toUpperCase() || 'CONFIRMED'}
                            </span>
                            <span>•</span>
                            <span>ID: #{booking.id}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-400" /> {formatDate(showtime.show_time || booking.show_date)}</div>
                            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> {showtime.show_time ? new Date(showtime.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : booking.show_time}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-pink-400" /> {theater.name || booking.theater_name || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Price & Toggle */}
                <div className="flex flex-col items-end justify-between min-w-[120px]">
                    <div className="text-right">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-white">₹{booking.total_price}</p>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 mt-4 md:mt-0">
                        {expanded ? 'Hide Details' : 'View Details'} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-white/5 bg-black/20 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h4>
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="text-white font-medium">{booking.user_email || 'Guest User'}</p>
                                <p className="text-xs text-gray-500">Booked on {new Date(booking.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Seat Information</h4>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(seats) && seats.map((seat, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white/10 rounded-lg text-sm font-mono text-white border border-white/5">
                                    {seat}
                                </span>
                            ))}
                            {(!seats || seats.length === 0) && <span className="text-gray-500 text-sm italic">No specific seat data</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsManager;
