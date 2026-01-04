import React, { useState, useEffect } from 'react';
import Ticket from '../components/Ticket';
import { ArrowLeft, Ticket as TicketIcon, User, Wallet, Film, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BlurCircle from '../components/BlurCircle';
import { getUserBookings } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, signOut, avatar, updateAvatar } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSpent: 0, moviesWatched: 0, topTheater: 'N/A' });

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings(user.id);

      // Transform Supabase data to UI format
      const formattedBookings = data.map(b => ({
        bookingId: b.id,
        movieName: b.showtimes?.movies?.title || "Unknown Movie",
        poster: b.showtimes?.movies?.poster_path || "https://via.placeholder.com/300x450",
        date: b.showtimes?.show_time,
        time: b.showtimes?.show_time,
        seats: b.seats,
        theater: b.showtimes?.theaters,
        totalPrice: b.total_price,
        screen: b.showtimes?.screen_number || "Screen 1"
      }));

      // Calculate Stats
      const totalSpent = formattedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      setStats({
        totalSpent,
        moviesWatched: formattedBookings.length,
        topGenre: 'Action' // Placeholder - would need movie genre data aggregation
      });

      // Sort by newest first
      setBookings(formattedBookings.reverse());
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result); // Use context update
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className='relative pt-24 pb-40 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-screen bg-black text-white'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* DASHBOARD HEADER */}
      <div className="relative z-10 mb-16">

        {/* Top Nav Line */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <div className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 group-hover:border-white/20">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden group">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-pink-600/20 transition-colors duration-500" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">

            {/* Avatar Orbit */}
            <div className="relative group/avatar cursor-pointer">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#1a1a1a]"
                />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              {/* Decorative Orbit Rings */}
              <div className="absolute inset-0 border border-white/20 rounded-full scale-110 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-0 border border-white/10 rounded-full scale-125 animate-reverse-spin pointer-events-none" />
            </div>

            {/* User Info & Stats */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{user?.user_metadata?.name || "Movie Buff"}</h1>
              <p className="text-gray-400 font-mono text-sm mb-8">{user?.email}</p>

              <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-white/10 pt-8">
                <div className="text-center md:text-left">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                    <TicketIcon className="w-3 h-3" /> Tickets
                  </p>
                  <p className="text-2xl md:text-3xl font-black text-white">{stats.moviesWatched}</p>
                </div>
                <div className="text-center md:text-left border-l border-white/10 pl-4 md:pl-8">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                    <Wallet className="w-3 h-3" /> Spent
                  </p>
                  <p className="text-2xl md:text-3xl font-black text-pink-500">₹{stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="text-center md:text-left border-l border-white/10 pl-4 md:pl-8">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                    <Film className="w-3 h-3" /> Status
                  </p>
                  <p className="text-xl md:text-2xl font-black text-purple-400">Gold Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <h2 className='text-3xl font-bold text-white'>Your Collection</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>

      {/* Bookings Grid */}
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/5 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-8 backdrop-blur-sm shadow-2xl"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <TicketIcon className="w-12 h-12 text-gray-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">No tickets yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">Your digital wallet is empty. Explore movies and book your first experience.</p>
              </div>
              <button
                onClick={() => navigate('/movies')}
                className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105 active:scale-95"
              >
                Browse Movies
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
              {bookings.map((booking, idx) => (
                <Ticket key={booking.bookingId} booking={booking} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default MyBookings;