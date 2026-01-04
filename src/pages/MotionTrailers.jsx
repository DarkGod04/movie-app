import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Info, Volume2, VolumeX, Play, ArrowLeft, Ticket, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyTrailers } from '../assets/assets'; // Using existing dummy data
import BlurCircle from '../components/BlurCircle';

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const VideoCard = ({ trailer, isActive, isMuted, toggleMute }) => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-full flex-shrink-0 snap-center bg-black overflow-hidden group">

            {/* Video Background */}
            <div className="absolute inset-0 pointer-events-none">
                {isActive ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(trailer.videoUrl)}?autoplay=1&controls=0&mute=${isMuted ? 1 : 0}&loop=1&playlist=${getYouTubeId(trailer.videoUrl)}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                        className="w-full h-full object-cover scale-[1.35] pointer-events-none"
                        title={trailer.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                ) : (
                    <img src={trailer.image} className="w-full h-full object-cover opacity-50 blur-sm scale-110" />
                )}
            </div>

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 opacity-50" />

            {/* Shimmer Button Effect Style */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .shimmer-btn {
                    background: linear-gradient(90deg, 
                        rgba(255,255,255,0.1) 0%, 
                        rgba(255,255,255,0.3) 50%, 
                        rgba(255,255,255,0.1) 100%);
                    background-size: 200% 100%;
                    animation: shimmer 3s infinite linear;
                }
                .equalizer-bar {
                    animation: equalize 1s infinite ease-in-out;
                }
                @keyframes equalize {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
            `}</style>

            {/* Right Sidebar Interactions - Floating Glass */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-20"
            >
                {[
                    { icon: Heart, count: "12.5k", color: "text-pink-500", bg: "group-hover/btn:bg-pink-500/20" },
                    { icon: MessageCircle, count: "842", color: "text-blue-500", bg: "group-hover/btn:bg-blue-500/20" },
                    { icon: Share2, count: "Share", color: "text-green-500", bg: "group-hover/btn:bg-green-500/20" }
                ].map((item, i) => (
                    <button key={i} className="flex flex-col items-center gap-1 group/btn">
                        <div className={`p-4 bg-white/5 backdrop-blur-xl rounded-full ${item.bg} transition-all border border-white/10 group-active/btn:scale-95 group-hover/btn:scale-110 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]`}>
                            <item.icon className={`w-6 h-6 text-white group-hover/btn:${item.color} transition-colors`} />
                        </div>
                        <span className="text-[10px] font-medium shadow-black drop-shadow-md text-gray-300">{item.count}</span>
                    </button>
                ))}
            </motion.div>

            {/* Bottom Info Section - Staggered Entry */}
            <div className="absolute bottom-0 left-0 w-full p-6 pb-24 md:pb-12 pt-32 bg-gradient-to-t from-black via-black/95 to-transparent">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-[85%] md:max-w-2xl px-2"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-600 to-purple-600 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)]">Now Showing</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <span className="text-xs font-bold tracking-wide drop-shadow-md">★ 9.2 IMDb</span>
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 leading-none mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] font-['Outfit'] tracking-tighter">
                        {trailer.title}
                    </h2>

                    <p className="text-gray-300 text-sm md:text-lg line-clamp-2 mb-8 font-light leading-relaxed drop-shadow-md max-w-lg">
                        Experience the cinematic masterpiece of the year. Witness {trailer.title} in breathtaking IMAX laser projection.
                    </p>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/movies')}
                            className="relative overflow-hidden flex-1 max-w-[220px] h-14 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all text-sm uppercase tracking-wider group"
                        >
                            <div className="absolute inset-0 shimmer-btn opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center gap-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-colors">
                                <Ticket className="w-5 h-5 group-hover:text-pink-600 transition-colors group-hover:rotate-12 transform duration-300" />
                                Get Tickets
                            </span>
                        </motion.button>

                        <motion.button
                            onClick={toggleMute}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-full backdrop-blur-xl hover:bg-white/10 transition-colors shadow-lg group"
                        >
                            {!isMuted ? (
                                <div className="flex items-end gap-1 h-5 mb-1">
                                    <div className="w-1 bg-pink-500 rounded-full equalizer-bar" style={{ animationDuration: '0.6s' }}></div>
                                    <div className="w-1 bg-purple-500 rounded-full equalizer-bar" style={{ animationDuration: '0.8s' }}></div>
                                    <div className="w-1 bg-blue-500 rounded-full equalizer-bar" style={{ animationDuration: '0.5s' }}></div>
                                    <div className="w-1 bg-green-500 rounded-full equalizer-bar" style={{ animationDuration: '0.7s' }}></div>
                                </div>
                            ) : (
                                <VolumeX className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-pink-600/30 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        </div>
    );
};

const MotionTrailers = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [trailers, setTrailers] = useState(dummyTrailers);

    // Scroll Observer & Infinite Scroll Logic
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (index !== activeIndex) {
                setActiveIndex(index);
            }

            // Infinite Scroll: Load more when near the end (last 2 items)
            if (index >= trailers.length - 2) {
                // Determine the next batch ensuring unique keys if needed or just unique data
                // For demo, we just duplicate existing list. To avoid key clashes if using simple index map, we just append.
                // ideally, fetch more unique content.
                setTrailers(prev => [...prev, ...dummyTrailers]);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex, trailers.length]);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden font-['Outfit']">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto p-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="w-10"></div> {/* Spacer for balance */}
            </div>

            {/* Vertical Scroll Snap Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar
            >
                {trailers.map((trailer, index) => (
                    <div key={`${trailer.id}-${index}`} className="w-full h-full snap-center relative">
                        <VideoCard
                            trailer={trailer}
                            isActive={index === activeIndex}
                            isMuted={isMuted}
                            toggleMute={() => setIsMuted(!isMuted)}
                        />
                    </div>
                ))}

                {/* Loading Indicator at bottom (will be pushed down as list grows) */}
                <div className="w-full h-24 flex items-center justify-center snap-center bg-black">
                    <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                </div>
            </div>
        </div>
    );
};

export default MotionTrailers;
