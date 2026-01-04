import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import timeFormat from '../assets/lib/timeFormat';

const TicketCard = ({ booking }) => {
    if (!booking || !booking.showtimes) return null;

    const { showtimes, seats = [], status, id } = booking;
    const { movies, theaters } = showtimes || {};

    if (!movies || !theaters) return null;

    // Formatting
    const showTime = showtimes.show_time ? new Date(showtimes.show_time) : new Date();
    const dateStr = !isNaN(showTime) ? showTime.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }) : "Date N/A";
    const timeStr = !isNaN(showTime) ? showTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Time N/A";
    const seatStr = Array.isArray(seats) ? seats.join(", ") : "No seats";

    return (
        <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5 group hover:border-pink-500/30 transition-all duration-500">

            {/* --- LEFT: Movie Image & Basic Info --- */}
            <div className="relative w-full md:w-1/3 aspect-[4/3] md:aspect-auto">
                <img
                    src={movies.poster_path}
                    alt={movies.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent md:hidden" />

                <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-black text-white leading-none mb-2 drop-shadow-lg">{movies.title}</h3>
                    <p className="text-gray-300 text-sm font-medium">{timeFormat(movies.runtime)} • {movies.genres?.[0] || "Movie"}</p>
                </div>
            </div>

            {/* --- MIDDLE: Ticket Details --- */}
            <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-between bg-[#1a1a1a]">
                {/* Perforation Effect (Visual) */}
                <div className="absolute hidden md:block left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full" />
                <div className="absolute hidden md:block right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-black rounded-full" />
                <div className="absolute hidden md:block right-0 top-4 bottom-4 border-r-2 border-dashed border-gray-700 opacity-30" />

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</span>
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                            <Calendar className="w-4 h-4 text-pink-500" /> {dateStr}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Time</span>
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                            <Clock className="w-4 h-4 text-pink-500" /> {timeStr}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Theater</span>
                        <div className="flex items-center gap-2 text-white font-medium">
                            <MapPin className="w-4 h-4 text-pink-500" />
                            {theaters.name}, <span className="text-gray-400 text-sm">{theaters.location}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Seats</span>
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                            {seatStr}
                        </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                        {status}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: QR Code Section --- */}
            <div className="w-full md:w-64 bg-white/5 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/5 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <div className="bg-white p-3 rounded-xl shadow-2xl">
                    <QRCodeSVG
                        value={JSON.stringify({ id, seats, theater: theaters.name })}
                        size={120}
                        fgColor="#000000"
                        bgColor="#ffffff"
                    />
                </div>
                <span className="mt-4 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold text-center">Scan to Enter</span>
                <span className="text-[10px] text-gray-600 font-mono mt-1">{id.split('-')[0].toUpperCase()}</span>

                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Ticket className="w-12 h-12 text-white/5 rotate-12" />
                </div>
            </div>

        </div>
    );
};

export default TicketCard;
