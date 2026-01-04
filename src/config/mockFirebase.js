// THIS FILE SIMULATES THE FIREBASE SDK
// It mimics the behavior of firebase/auth and firebase/firestore
// using localStorage, so the app works without API keys.

export const auth = {
    currentUser: null
};

export const db = {};

// --- AUTH MOCKS ---

export const createUserWithEmailAndPassword = async (auth, email, password) => {
    console.log("Mock Create User:", email);
    await new Promise(r => setTimeout(r, 1000)); // Simulate network delay

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('db_users') || '{}');
    if (users[email]) {
        const error = new Error("Email already in use");
        error.code = 'auth/email-already-in-use';
        throw error;
    }

    const uid = 'user_' + Math.random().toString(36).substr(2, 9);
    const user = { uid, email, displayName: '' };

    // Save "Session"
    localStorage.setItem('user_session', JSON.stringify(user));
    auth.currentUser = user;

    return { user };
};

export const signInWithEmailAndPassword = async (auth, email, password) => {
    console.log("Mock Sign In:", email);
    await new Promise(r => setTimeout(r, 1000));

    // "Login" with any credentials for demo, or simulate checking db
    // For a smoother demo, we'll allow any login or check our local 'db_users'
    const users = JSON.parse(localStorage.getItem('db_users') || '{}');
    const userEntry = Object.values(users).find(u => u.email === email);

    // If we want strict mode:
    // if (!userEntry) throw new Error("User not found");

    // Relaxed mode for demo: Create a mock ID if not found
    const uid = userEntry?.uid || 'user_' + Math.random().toString(36).substr(2, 9);
    const user = { uid, email, displayName: userEntry?.name || 'Demo User' };

    localStorage.setItem('user_session', JSON.stringify(user));
    auth.currentUser = user;

    return { user };
};

export const GoogleAuthProvider = class {
    constructor() { this.providerId = 'google.com'; }
};

export const signInWithPopup = async (auth, provider) => {
    console.log("Mock Popup Sign In:", provider.providerId);
    await new Promise(r => setTimeout(r, 1500)); // Longer delay for "popup" feel

    const email = `user_${Math.floor(Math.random() * 1000)}@gmail.com`;
    const uid = 'google_' + Math.random().toString(36).substr(2, 9);
    const user = {
        uid,
        email,
        displayName: 'Google User',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user'
    };

    localStorage.setItem('user_session', JSON.stringify(user));
    auth.currentUser = user;

    return { user };
};

export const sendPasswordResetEmail = async (auth, email) => {
    console.log("Mock Password Reset:", email);
    await new Promise(r => setTimeout(r, 800));
    // Always succeed for mock
    return true;
};

export const signOut = async (auth) => {
    await new Promise(r => setTimeout(r, 500));
    localStorage.removeItem('user_session');
    auth.currentUser = null;
};

export const updateProfile = async (user, updates) => {
    user.displayName = updates.displayName;
    // Update session
    localStorage.setItem('user_session', JSON.stringify(user));
};

// --- FIRESTORE MOCKS ---

export const doc = (db, collection, id) => {
    return { path: `${collection}/${id}`, id };
};

export const setDoc = async (docRef, data) => {
    console.log("Mock Firestore Set:", docRef.path, data);
    await new Promise(r => setTimeout(r, 500));

    // Store in a giant object in localStorage
    const dbData = JSON.parse(localStorage.getItem('db_firestore') || '{}');
    dbData[docRef.path] = data;
    localStorage.setItem('db_firestore', JSON.stringify(dbData));

    // Also update our helper 'db_users' for login lookups
    if (docRef.path.startsWith('users/')) {
        const users = JSON.parse(localStorage.getItem('db_users') || '{}');
        users[data.email] = { ...data, uid: docRef.id };
        localStorage.setItem('db_users', JSON.stringify(users));
    }
};

export const getDoc = async (docRef) => {
    console.log("Mock Firestore Get:", docRef.path);
    await new Promise(r => setTimeout(r, 500));

    const dbData = JSON.parse(localStorage.getItem('db_firestore') || '{}');
    const data = dbData[docRef.path];

    return {
        exists: () => !!data,
        data: () => data
    };
};
