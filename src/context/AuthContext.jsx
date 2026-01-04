import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check initial session
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setSession(session)
                setUser(session?.user ?? null)
            } catch (error) {
                console.error('Error checking session:', error)
            } finally {
                setLoading(false)
            }
        }

        checkSession()

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const splitFullName = (fullName) => {
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        return { firstName, lastName };
    };

    const signUp = async (email, password, fullName) => {
        // 1. Sign up the user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) throw error

        // 2. Separate metadata update effectively if needed, but 'options.data' usually handles it.
        // If you need to ensure display_name is set or other metadata, you can do it here.
        return data
    }

    const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })

    const signInWithGoogle = () => supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    })

    const updateProfile = async (updates) => {
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        })
        if (error) throw error
        setUser(data.user)
        return data.user
    }

    const signOut = () => supabase.auth.signOut()

    const [avatar, setAvatar] = useState(localStorage.getItem('userAvatar'));

    const updateAvatar = (newAvatar) => {
        setAvatar(newAvatar);
        localStorage.setItem('userAvatar', newAvatar);
    };

    const value = {
        user,
        session,
        loading,
        avatar,
        updateAvatar,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
