import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
    return (
        <div className="fixed inset-0 min-h-screen bg-black flex flex-col items-center justify-center z-50">
            {/* Ambient Background Glows */}
            <div className="absolute w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px] pointer-events-none animate-pulse" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-pink-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/5 rounded-full backdrop-blur-md" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase">QuickShow</h3>
                    <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 animate-progress" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-progress {
                    animation: progress 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Loading;
