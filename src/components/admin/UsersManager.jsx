import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Shield, User, Calendar, Wallet, MoreVertical, Eye, Ban, Trash2, Mail, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchAndAggregateUsers();
    }, []);

    const fetchAndAggregateUsers = async () => {
        setLoading(true);
        try {
            // 1. Fetch all bookings
            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (bookingsError) throw bookingsError;

            // 2. Fetch all favorites
            const { data: favorites, error: favoritesError } = await supabase
                .from('favorites')
                .select('*');

            if (favoritesError) throw favoritesError;

            // 3. Aggregate Data
            const userMap = new Map();

            // Process Bookings
            bookings?.forEach(booking => {
                const userId = booking.user_id;
                if (!userMap.has(userId)) {
                    userMap.set(userId, {
                        id: userId,
                        firstSeen: booking.created_at,
                        lastActive: booking.created_at,
                        totalSpent: 0,
                        bookingsCount: 0,
                        favoritesCount: 0,
                        source: 'Booking'
                    });
                }

                const user = userMap.get(userId);
                user.totalSpent += (booking.total_price || 0);
                user.bookingsCount += 1;
                if (new Date(booking.created_at) > new Date(user.lastActive)) {
                    user.lastActive = booking.created_at;
                }
                // If we found them via booking earlier, keep earliest date
                if (new Date(booking.created_at) < new Date(user.firstSeen)) {
                    user.firstSeen = booking.created_at;
                }
            });

            // Process Favorites
            favorites?.forEach(fav => {
                const userId = fav.user_id;
                if (!userMap.has(userId)) {
                    userMap.set(userId, {
                        id: userId,
                        firstSeen: fav.created_at,
                        lastActive: fav.created_at,
                        totalSpent: 0,
                        bookingsCount: 0,
                        favoritesCount: 0,
                        source: 'Favorite'
                    });
                }

                const user = userMap.get(userId);
                user.favoritesCount += 1;
                // Favorites might not have created_at in some schemas, handle safely if needed
                if (fav.created_at && new Date(fav.created_at) > new Date(user.lastActive)) {
                    user.lastActive = fav.created_at;
                }
            });

            const aggregatedUsers = Array.from(userMap.values()).sort((a, b) =>
                new Date(b.lastActive) - new Date(a.lastActive)
            );

            setUsers(aggregatedUsers);

        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#1a1a1a]/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by User ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-gray-300 transition-colors flex items-center gap-2 border border-white/5">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-purple-500/20">
                        <ExternalLink className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-[#1a1a1a]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <User className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <p className="text-gray-400 font-medium">No active users found</p>
                                            <p className="text-xs text-gray-600">Users appear here after making a booking or favorite.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400">
                                                    {user.id.slice(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white font-mono">{user.id.slice(0, 8)}...</span>
                                                    <span className="text-xs text-gray-500">via {user.source}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Wallet className="w-3 h-3 text-green-400" />
                                                    <span className="text-sm text-green-400 font-bold">₹{user.totalSpent.toLocaleString()}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{user.bookingsCount} bookings</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-300">{formatDate(user.lastActive)}</span>
                                                <span className="text-xs text-gray-600">Last active</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-400">{formatDate(user.firstSeen)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-purple-500/20 rounded-lg text-purple-400 transition-colors" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Ban User (Mock)">
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual Only) */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {filteredUsers.length} users</span>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 rounded bg-white/5 text-gray-600 cursor-not-allowed">Previous</button>
                        <button disabled className="px-3 py-1 rounded bg-white/5 text-gray-600 cursor-not-allowed">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersManager;
