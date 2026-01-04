
import { supabase } from './supabaseClient';

// --- THEATERS ---
export const fetchTheaters = async () => {
    const { data, error } = await supabase
        .from('theaters')
        .select('*');
    if (error) throw error;
    return data;
};

// Helper to seed theaters if none exist
export const seedTheaters = async () => {
    const { count } = await supabase.from('theaters').select('*', { count: 'exact', head: true });
    if (count > 0) return;

    const dummyTheaters = [
        { name: 'PVR: Vegas Mall, Dwarka', location: 'Dwarka, New Delhi', facilities: ['Dolby Atmos', 'Recliner', '4DX'] },
        { name: 'INOX: Nehru Place', location: 'Nehru Place, New Delhi', facilities: ['IMAX', 'Laser', 'F&B'] },
        { name: 'Cinepolis: DLF Avenue', location: 'Saket, New Delhi', facilities: ['Coffe Shop', 'Lounge'] },
        { name: 'PVR: Pacific Mall', location: 'Subhash Nagar, New Delhi', facilities: ['Gold Class', 'Playhouse'] },
        { name: 'PVR: Director\'s Cut', location: 'Vasant Kunj, New Delhi', facilities: ['Luxury', 'Gourmet Food', 'Recliner'] },
        { name: 'Liberty Cinema', location: 'Karol Bagh, New Delhi', facilities: ['Heritage', 'Single Screen', 'Dolby 7.1'] },
        { name: 'Satyem Cineplex', location: 'Janakpuri, New Delhi', facilities: ['Family Friendly', 'Budget'] },
    ];

    const { error } = await supabase.from('theaters').insert(dummyTheaters);
    if (error) console.error("Error seeding theaters:", error);
};

// --- MOVIES ---
export const ensureMovieExists = async (omdbMovie) => {
    // Check if movie exists
    const { data: existing } = await supabase
        .from('movies')
        .select('id')
        .eq('omdb_id', omdbMovie.imdbID)
        .maybeSingle();

    if (existing) return existing.id;

    // Insert if not exists
    const { data: newMovie, error } = await supabase
        .from('movies')
        .insert({
            omdb_id: omdbMovie.imdbID,
            title: omdbMovie.Title,
            poster_path: omdbMovie.Poster,
            // Use a placeholder if no backdrop, or use poster
            backdrop_path: omdbMovie.Poster,
            genres: omdbMovie.Genre ? omdbMovie.Genre.split(',').map(g => g.trim()) : [],
            runtime: parseInt(omdbMovie.Runtime) || 0
        })
        .select()
        .single();

    if (error) throw error;
    return newMovie.id;
};

export const getMovieByOmdbId = async (omdbId) => {
    const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('omdb_id', omdbId)
        .maybeSingle(); // Use maybeSingle to avoid error if not found

    if (error) console.error("Error fetching movie by OMDb ID:", error);
    return data;
};

// --- SHOWTIMES ---
// Get showtimes for a specific movie and date
export const fetchShowtimes = async (movieId, date) => {
    // Note: We need to filter by date. 
    // Showtimes are stored as timestamptz. We want start of day to end of day.
    const startOfDay = new Date(`${date}T00:00:00`).toISOString();
    const endOfDay = new Date(`${date}T23:59:59`).toISOString();

    const { data, error } = await supabase
        .from('showtimes')
        .select(`
            id,
            show_time,
            screen_number,
            price_standard,
            price_vip,
            theaters (
                id,
                name,
                location
            )
        `)
        .eq('movie_id', movieId)
        .gte('show_time', startOfDay)
        .lte('show_time', endOfDay)
        .order('show_time');

    if (error) throw error;
    return data;
};



// Helper to seed logic: if no showtimes exist for this movie today, create some dummy ones for demo purposes
export const ensureShowtimesForMovie = async (dbMovieId, theaterIds, dateStr) => {
    // Check if we have any showtimes for this movie on this date
    const showtimes = await fetchShowtimes(dbMovieId, dateStr);
    if (showtimes && showtimes.length > 0) return showtimes;

    // If not, generate some
    const times = ['09:30', '12:30', '15:30', '18:30', '21:30'];
    const newShowtimes = [];

    for (const theaterId of theaterIds) {
        // Pick random times for each theater
        const selectedTimes = times.filter(() => Math.random() > 0.3); // 70% chance

        for (const time of selectedTimes) {
            const showTime = new Date(`${dateStr}T${time}:00`).toISOString();

            // Randomize prices
            const priceStd = Math.floor(Math.random() * (350 - 180 + 1) + 180);
            const priceVip = Math.floor(Math.random() * (600 - 400 + 1) + 400);

            // Round to nearest 10
            const finalStd = Math.ceil(priceStd / 10) * 10;
            const finalVip = Math.ceil(priceVip / 10) * 10;

            newShowtimes.push({
                theater_id: theaterId,
                movie_id: dbMovieId,
                show_time: showTime,
                screen_number: `Screen ${Math.floor(Math.random() * 5) + 1}`,
                price_standard: finalStd,
                price_vip: finalVip
            });
        }
    }

    if (newShowtimes.length > 0) {
        const { error } = await supabase.from('showtimes').insert(newShowtimes);
        if (error) console.error("Error generating dummy showtimes:", error);
    }

    return await fetchShowtimes(dbMovieId, dateStr);
}

// Fetch all movies that have future showtimes (for Releases page)
export const fetchMoviesWithShowtimes = async () => {
    const now = new Date().toISOString();

    // 1. Get IDs of movies with upcoming showtimes
    const { data: showtimes, error: stError } = await supabase
        .from('showtimes')
        .select('movie_id')
        .gte('show_time', now);

    if (stError) throw stError;

    if (!showtimes || showtimes.length === 0) return [];

    // 2. Deduplicate IDs
    const uniqueIds = [...new Set(showtimes.map(st => st.movie_id))];

    // 3. Fetch full movie details
    const { data: movies, error: mError } = await supabase
        .from('movies')
        .select('*')
        .in('id', uniqueIds);

    if (mError) throw mError;
    return movies;
};


// --- BOOKINGS ---
export const getBookedSeats = async (showtimeId) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('seats')
        .eq('showtime_id', showtimeId)
        .eq('status', 'confirmed');

    if (error) throw error;

    // Flatten array of arrays: [['A1', 'A2'], ['B1']] -> ['A1', 'A2', 'B1']
    const allSeats = data.reduce((acc, booking) => [...acc, ...booking.seats], []);
    return allSeats;
};

export const createBooking = async ({ userId, showtimeId, seats, totalPrice }) => {
    const { data, error } = await supabase
        .from('bookings')
        .insert({
            user_id: userId,
            showtime_id: showtimeId,
            seats,
            total_price: totalPrice,
            status: 'confirmed'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getUserBookings = async (userId) => {
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}


// --- FAVORITES ---
export const toggleFavorite = async (userId, movie) => {
    // Check if exists
    const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('movie_id', movie.id)
        .eq('movie_id', movie.id)
        .maybeSingle();

    if (data) {
        // Remove
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('movie_id', movie.id);
        if (error) throw error;
        return false; // Not favorited anymore
    } else {
        // Add
        const { error } = await supabase
            .from('favorites')
            .insert({
                user_id: userId,
                movie_id: movie.id,
                movie_data: movie // Store the whole movie object for easy display
            });
        if (error) throw error;
        return true; // Favorited
    }
};

export const checkIsFavorite = async (userId, movieId) => {
    const { count, error } = await supabase
        .from('favorites')
        .select('movie_id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('movie_id', movieId);

    if (error) return false;
    return count > 0;
};

export const getFavorites = async (userId) => {
    const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(f => f.movie_data); // Return the cached movie objects
};
// --- SEARCH ---
export const searchMovies = async (query) => {
    if (!query) return [];
    const { data, error } = await supabase
        .from('movies')
        .select('*')
        .ilike('title', `%${query}%`)
        .limit(10);

    if (error) {
        console.error("Error searching movies:", error);
        return [];
    }
    return data;
};
