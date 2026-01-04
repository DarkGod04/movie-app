import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// HARDCODED ADMINS FOR DEMO
// In production, this should be handled via Supabase Roles/Claims
const ADMIN_EMAILS = [
    'nikhilkumarsingh004@gmail.com',
    'admin@quickshow.com'
];

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            </div>
        );
    }

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        toast.error("Access Denied: Admins only Area 51 👽");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
