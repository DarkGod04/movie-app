import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, Film, Star, Share2, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toBlob } from 'html-to-image';
import toast from 'react-hot-toast';

const Ticket = ({ booking }) => {
    const { movieName, poster, date, time, seats, theater, totalPrice, bookingId, screen } = booking;
    const ticketRef = useRef(null);
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        if (!ticketRef.current) return;
        setIsSharing(true);

        try {
            // Using html-to-image for better compatibility and foreignObject support
            const blob = await toBlob(ticketRef.current, {
                cacheBust: true,
                canvasWidth: 600, // Enforce good resolution width
                pixelRatio: 2, // High DPI
                skipAutoScale: true,
                backgroundColor: null,
                filter: (node) => {
                    // Filter out any elements if needed (e.g. controls)
                    return !node.className?.includes('exclude-from-capture');
                }
            });

            if (!blob) throw new Error("Generated blob was null");

            const file = new File([blob], `ticket-${bookingId}.png`, { type: 'image/png' });

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `My Ticket for ${movieName}`,
                        text: `Checking out ${movieName} at ${theater?.name}! 🍿 #QuickShow`,
                        files: [file]
                    });
                    toast.success("Shared successfully!");
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error("Share failed", err);
                        downloadImage(blob);
                    }
                }
            } else {
                downloadImage(blob);
            }

        } catch (error) {
            console.error("Error generating ticket image:", error);
            // Fallback: If advanced capture fails, try simplified mode
            try {
                toast("Retrying in safe mode...", { icon: '🔄' });
                const safeBlob = await toBlob(ticketRef.current, {
                    cacheBust: true,
                    pixelRatio: 1
                });
                if (safeBlob) downloadImage(safeBlob);
            } catch (retryError) {
                toast.error("Could not capture ticket. Try a screenshot!");
            }
        } finally {
            setIsSharing(false);
        }
    };

    const downloadImage = (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${bookingId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Ticket downloaded!");
    };


    return (
        <div className="relative group perspective-1000">
            {/* Main Ticket Container to Capture */}
            <motion.div
                ref={ticketRef}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="relative w-full max-w-sm mx-auto bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
                {/* Holographic Glow Effect (Visual only, might not capture perfectly but adds to UI) */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500 animate-gradient-xy -z-10" />

                {/* Ticket Header (Movie Poster Area) */}
                <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent z-10" />
                    <img
                        src={poster || "https://via.placeholder.com/400x200"}
                        alt={movieName}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-none mb-1">{movieName}</h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-pink-500 uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg w-fit">
                            <Film className="w-3 h-3" />
                            <span>Cinema Ticket</span>
                        </div>
                    </div>
                </div>

                {/* Perforation Line */}
                <div className="relative flex items-center justify-between px-4 -mt-6 z-20">
                    <div className="w-6 h-6 rounded-full bg-black -ml-7" />
                    <div className="flex-1 border-t-2 border-dashed border-white/20 mx-2" />
                    <div className="w-6 h-6 rounded-full bg-black -mr-7" />
                </div>

                {/* Ticket Body (Details) */}
                <div className="p-6 pt-2 space-y-4">

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Date & Time</p>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Calendar className="w-4 h-4 text-pink-500" />
                                <span>{new Date(date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white font-medium mt-1">
                                <Clock className="w-4 h-4 text-purple-500" />
                                <span>{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Seats</p>
                            <p className="text-xl font-black text-white">{seats.join(', ')}</p>
                            <p className="text-xs text-gray-400 font-medium">{screen || "Screen 1"}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <MapPin className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">{theater?.name || "PVR Cinemas"}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{theater?.location || "Downtown Mall"}</p>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Booking ID</p>
                            <p className="font-mono text-pink-500 font-bold tracking-wider">{bookingId ? `#${bookingId.slice(-6).toUpperCase()}` : '#123456'}</p>
                            <p className="text-xs text-gray-400 mt-1">Total: ₹{totalPrice}</p>
                        </div>

                        <div className="bg-white p-2 rounded-lg relative overflow- hidden group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300">
                            <QRCodeSVG value={bookingId || "mock-id"} size={64} />
                            {/* Scan Line Animation */}
                            <motion.div
                                initial={{ top: 0 }}
                                animate={{ top: "100%" }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_5px_red] w-full"
                            />
                        </div>
                    </div>

                </div>

                {/* Bottom Foil Strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20" />
            </motion.div>

            {/* Share Button (Outside captured area, overlays on hover) */}
            <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 text-white shadow-lg transition-all transform hover:scale-110 active:scale-95"
                    title="Share Ticket"
                >
                    {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default Ticket;
