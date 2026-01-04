import React, { useState, useEffect } from 'react';
import PaymentModal from '../components/PaymentModal';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBookedSeats, createBooking, getMovieByOmdbId, fetchShowtimes, ensureMovieExists, fetchTheaters, ensureShowtimesForMovie } from '../lib/db';
import { useAuth } from '../context/AuthContext';

const ROWS = 7;
const COLS_LEFT = 9;
const COLS_RIGHT = 9;
// Helper to generate deterministic price based on ID
const generatePrice = (id, type) => {
  if (!id) return type === 'standard' ? 250 : 400;

  // Simple hash extraction
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Ranges
  const min = type === 'standard' ? 180 : 350;
  const max = type === 'standard' ? 320 : 600;

  // Normalize to range
  const range = max - min;
  let normalized = Math.abs(hash % range) + min;

  // Round to nearest 10
  return Math.ceil(normalized / 10) * 10;
};

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [stateData, setStateData] = useState(location.state || {});
  const [movie, setMovie] = useState(stateData?.movie || {});
  const [showtime, setShowtime] = useState(stateData?.showtime || {});
  const [loadingInfo, setLoadingInfo] = useState(!stateData?.showtime);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Recovery logic for refresh
  useEffect(() => {
    if (!showtime.id && id && date) {
      const fetchData = async () => {
        try {
          setLoadingInfo(true);
          const OMDB_API_KEY = "1e43b127";

          // 1. Try to get Movie from DB
          let dbMovie = await getMovieByOmdbId(id);

          // 2. If not in DB, fetch from OMDb and Insert
          if (!dbMovie) {
            const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`);
            const data = await res.json();

            if (data.Response === "True") {
              const dbId = await ensureMovieExists(data);
              // Fetch the newly created movie object
              dbMovie = await getMovieByOmdbId(id);
            } else {
              toast.error("Movie details not found");
              navigate('/movies');
              return;
            }
          }

          if (!dbMovie) {
            toast.error("Failed to load movie"); // Should not happen if ensure works
            navigate('/movies');
            return;
          }

          // 3. Get Showtimes for Date
          let showtimes = await fetchShowtimes(dbMovie.id, date);

          // 4. If no showtimes, generate them (same logic as MovieDetail)
          if (!showtimes || showtimes.length === 0) {
            const theaters = await fetchTheaters();
            const theaterIds = theaters ? theaters.map(t => t.id) : [];
            if (theaterIds.length > 0) {
              showtimes = await ensureShowtimesForMovie(dbMovie.id, theaterIds, date);
            }
          }

          if (!showtimes || showtimes.length === 0) {
            toast.error("No showtimes available for this date");
            navigate(`/movies/${id}`);
            return;
          }

          // 5. Default to first showtime (as fallback behavior for reset)
          const targetShowtime = showtimes[0];

          setShowtime(targetShowtime);
          // Generate realistic prices for this specific movie
          const stdPrice = generatePrice(dbMovie.imdbID || id, 'standard');
          const vipPrice = generatePrice(dbMovie.imdbID || id, 'vip');

          // If DB has default prices (250/400), prefer our dynamic calculation for realism
          const dbStd = targetShowtime.price_standard;
          const dbVip = targetShowtime.price_vip;
          const isDefault = dbStd === 250 || dbStd === 0;

          setMovie({
            ...dbMovie,
            prices: {
              standard: (!isDefault && dbStd) ? dbStd : stdPrice,
              vip: (!isDefault && dbVip) ? dbVip : vipPrice
            }
          });

        } catch (err) {
          console.error("Error restoring session:", err);
          toast.error(`Session Error: ${err.message}`);
        } finally {
          setLoadingInfo(false);
        }
      };

      fetchData();
    }
  }, [id, date, showtime.id]);

  // Fetch booked seats separately
  useEffect(() => {
    if (showtime.id) {
      setLoadingBookings(true);
      getBookedSeats(showtime.id)
        .then(seats => setBookedSeats(seats))
        .catch(err => console.error("Error fetching seats:", err))
        .finally(() => setLoadingBookings(false));
    }
  }, [showtime.id]);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        toast.error("You can only select up to 6 seats");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const prices = movie.prices || { standard: generatePrice(id, 'standard'), vip: generatePrice(id, 'vip') };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const row = seat.charAt(0);
      const price = row >= 'F' ? prices.vip : prices.standard;
      return total + price;
    }, 0);
  };

  const handleBookTickets = async () => {
    if (selectedSeats.length === 0) return;
    if (!user) {
      toast.error("Please login to book tickets");
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      await createBooking({
        userId: user.id,
        showtimeId: showtime.id,
        seats: selectedSeats,
        totalPrice: calculateTotal()
      });
      toast.success("Booking Confirmed!");
      navigate('/mybookings');
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Booking failed. Please try again.");
    }
  };

  const renderSeat = (rowLabel, colIndex, side) => {
    const seatNum = side === 'left' ? colIndex + 1 : colIndex + 10;
    const seatId = `${rowLabel}${seatNum}`;
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    // Simple logic (F row and above is VIP)
    const isVip = rowLabel >= 'F';

    return (
      <motion.button
        key={seatId}
        whileHover={!isBooked ? { scale: 1.2 } : {}}
        whileTap={!isBooked ? { scale: 0.9 } : {}}
        onClick={() => toggleSeat(seatId)}
        disabled={isBooked}
        className={`
            w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs font-medium transition-all duration-300 relative
            ${isBooked
            ? 'bg-white/10 text-transparent cursor-not-allowed border border-white/5'
            : isSelected
              ? isVip
                ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-400 z-10' // VIP Selected
                : 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] border border-pink-500 z-10'  // Standard Selected
              : isVip
                ? 'bg-transparent border border-white/20 text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]' // VIP Hover
                : 'bg-transparent border border-white/20 text-gray-400 hover:border-pink-500 hover:text-white hover:bg-white/5' // Standard Hover
          }
        `}
      >
        {/* Glow Effect for Selected */}
        {isSelected && <motion.div layoutId={`glow-${seatId}`} className={`absolute inset-0 blur-md rounded-lg -z-10 ${isVip ? 'bg-amber-500' : 'bg-pink-500'}`} />}

        {/* Dot for Booked */}
        {isBooked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Seat Number */}
        {!isBooked && !isSelected && <span className="opacity-50">{seatNum}</span>}

        {/* VIP Indicator (Crown icon or just visual distinctness) */}
        {!isBooked && !isSelected && isVip && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500/50 rounded-full blur-[1px]" />
        )}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">

      {/* LEFT SIDEBAR - INFO */}
      <div className="w-full md:w-80 p-8 flex flex-col gap-8 border-r border-white/5 bg-[#0a0a0a] z-20">
        <div onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold uppercase tracking-wider text-sm">Back</span>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-2">{movie.title || "Select Seats"}</h2>
          <p className="text-gray-500 text-sm">{date} • {showtime.screen_number || "Screen 1"}</p>
        </div>

        {/* Theater Info Card */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold">{showtime.theaters?.name || "Theater"}</h3>
              <p className="text-xs text-gray-400">{showtime.theaters?.location}</p>
            </div>
          </div>
          <div className="py-2 px-4 bg-pink-600/20 text-pink-500 rounded-lg text-sm font-bold border border-pink-500/30 text-center mb-4">
            {showtime.show_time ? new Date(showtime.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Time"}
          </div>
          <div className="text-xs text-gray-400 font-medium flex justify-between">
            <span>Std: ₹{prices.standard}</span>
            <span>VIP: ₹{prices.vip}</span>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-4 h-4 rounded bg-white/5 border border-white/20"></div> Available
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-4 h-4 rounded bg-pink-600 border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div> Selected
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-4 h-4 rounded bg-white/10 border border-white/5 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full" /></div> Booked
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - SEAT MAP */}
      <div className="flex-1 relative bg-black flex flex-col items-center justify-center p-4 min-h-screen overflow-y-auto">

        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" />

        {/* SCREEN */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-16 relative w-full max-w-3xl flex flex-col items-center group"
        >
          <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent rounded-full shadow-[0_10px_40px_rgba(236,72,153,0.3)] mb-4" />
          <div className="w-full h-16 bg-gradient-to-b from-pink-500/10 to-transparent transform perspective-[500px] rotateX-45 mask-linear-fade" />
          <span className="text-pink-500/50 text-xs font-bold tracking-[0.5em] uppercase mt-2">Screen Side</span>
        </motion.div>

        {/* SEAT GRID */}
        <div className="flex flex-col gap-3 md:gap-4 relative z-10">
          {loadingBookings ? (
            <div className="text-white text-center animate-pulse">Loading seats...</div>
          ) : (
            Array.from({ length: ROWS }).map((_, rIndex) => {
              const rowLabel = String.fromCharCode(65 + rIndex); // A, B, C...
              return (
                <motion.div
                  key={rowLabel}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: rIndex * 0.1 }}
                  className="flex items-center gap-8 md:gap-16"
                >
                  {/* Left Side */}
                  <div className="flex gap-2 md:gap-3">
                    <span className="w-6 text-right text-gray-600 font-bold text-xs pt-2.5 mr-2">{rowLabel}</span>
                    {Array.from({ length: COLS_LEFT }).map((_, cIndex) => renderSeat(rowLabel, cIndex, 'left'))}
                  </div>

                  {/* Aisle / Right Side */}
                  <div className="flex gap-2 md:gap-3">
                    {Array.from({ length: COLS_RIGHT }).map((_, cIndex) => renderSeat(rowLabel, cIndex, 'right'))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* BOTTOM FLOATING BAR */}
        <div className="fixed bottom-8 left-1/2 md:left-[calc(50%+160px)] -translate-x-1/2 w-[90%] max-w-2xl z-50">
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white/10 backdrop-blur-3xl border border-white/10 p-4 md:p-6 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">₹{calculateTotal()}</span>
                <span className="text-sm text-gray-400">for {selectedSeats.length} seats</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={selectedSeats.length === 0}
              className={`
                  px-8 py-3 font-bold rounded-xl shadow-lg transition-all transform
                  ${selectedSeats.length > 0
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white hover:scale-105 active:scale-95 hover:shadow-pink-500/25'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }
                `}
            >
              Proceed to Pay
            </button>
          </motion.div>
        </div>

      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={calculateTotal()}
        onSuccess={handleBookTickets}
      />

    </div>
  );
};

export default SeatLayout;