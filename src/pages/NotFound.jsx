import React from 'react';
import { Home, MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">

            {/* Background Animation */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534067783741-51478487d90e?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

            <div className="relative z-10 text-center px-6">
                <h1 className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 select-none animate-glitch">
                    404
                </h1>

                <div className="space-y-4 mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Lost in the Multiverse?</h2>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto">
                        The scene you're looking for was cut from the final edit. It seems this timeline doesn't exist.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all flex items-center gap-2 group"
                    >
                        <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Return Home
                    </button>
                </div>
            </div>

            <style jsx>{`
            @keyframes glitch {
                0% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; }
                25% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; }
                50% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; }
                75% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; }
                100% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; }
            }
            .animate-glitch {
                animation: glitch 3s infinite steps(2);
            }
        `}</style>
        </div>
    );
};

export default NotFound;
