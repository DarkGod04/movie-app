import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Ticket, Settings, ChevronDown, Plus, Wallet, Film, Phone, Mail, User, Check, X, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../lib/db';
import toast from 'react-hot-toast';

const UserMenu = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut, updateProfile, avatar } = useAuth();
    const menuRef = useRef(null);
    const [stats, setStats] = useState({ count: 0, spent: 0 });

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: ''
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsEditing(false); // Reset editing on close
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && user) {
            fetchStats();
            setFormData({
                fullName: user.user_metadata?.full_name || '',
                phone: user.user_metadata?.phone || ''
            });
        }
    }, [isOpen, user]);

    const fetchStats = async () => {
        try {
            const bookings = await getUserBookings(user.id);
            const totalSpent = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
            setStats({ count: bookings.length, spent: totalSpent });
        } catch (error) {
            console.error("Error fetching menu stats:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfile({
                data: {
                    full_name: formData.fullName,
                    phone: formData.phone
                }
            });
            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
                {/* Avatar Button */}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
                    {avatar ? (
                        <img src={avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-sm">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <div
                className={`absolute top-full right-0 mt-3 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 origin-top-right z-50
                ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            >
                {/* Header - Clickable (Only if not editing) */}
                <div
                    onClick={() => { if (!isEditing) { setIsOpen(false); navigate('/mybookings'); } }}
                    className={`p-5 border-b border-white/5 flex items-center gap-4 bg-white/5 transition-colors ${!isEditing ? 'cursor-pointer hover:bg-white/10' : ''}`}
                >
                    {/* Header Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg bg-black">
                        {avatar ? (
                            <img src={avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-bold text-xl">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-white font-bold truncate">{user.user_metadata?.full_name || 'User'}</h4>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                </div>

                {/* Quick Stats - Only show if NOT editing */}
                {!isEditing && (
                    <div className="grid grid-cols-2 border-b border-white/5 bg-black/20">
                        <div className="p-3 text-center border-r border-white/5 hover:bg-white/5 transition-colors cursor-default">
                            <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center justify-center gap-1">
                                <Ticket className="w-3 h-3" /> Tickets
                            </p>
                            <p className="text-white font-bold">{stats.count}</p>
                        </div>
                        <div className="p-3 text-center hover:bg-white/5 transition-colors cursor-default">
                            <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center justify-center gap-1">
                                <Wallet className="w-3 h-3" /> Spent
                            </p>
                            <p className="text-pink-500 font-bold">₹{stats.spent}</p>
                        </div>
                    </div>
                )}

                {/* Menu Items / Edit Form */}
                <div className="p-2">
                    {isEditing ? (
                        <div className="p-2 space-y-3 bg-black/20 rounded-xl m-1">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Phone
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Add phone number"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <input
                                    type="text"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-white/5 border border-transparent rounded-lg px-2 py-1.5 text-sm text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-1 py-1.5 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                >
                                    <Check className="w-3 h-3" /> Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                >
                                    <X className="w-3 h-3" /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                            >
                                <Settings className="w-4 h-4" />
                                Manage account
                            </button>

                            {/* Admin Link - Hardcoded for demo/simplicity */}
                            {(user.email === 'nikhilkumarsingh004@gmail.com' || user.email === 'admin@quickshow.com') && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors text-left font-bold"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Admin Panel
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/mybookings')}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                            >
                                <Ticket className="w-4 h-4" />
                                My Bookings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </button>
                        </>
                    )}
                </div>

                {/* Footer Action */}
                {!isEditing && (
                    <div className="p-2 border-t border-white/5 bg-black/20">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left border-dashed border border-white/10">
                            <Plus className="w-4 h-4" />
                            Add account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;
