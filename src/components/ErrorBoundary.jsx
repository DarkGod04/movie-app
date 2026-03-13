import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                    {/* Ambient Red Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[128px] pointer-events-none" />

                    <div className="relative z-10 bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl max-w-md w-full shadow-2xl">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-3 tracking-tight">Something went wrong</h1>
                        <p className="text-gray-400 mb-8">
                            We encountered an unexpected error. The application has been paused to prevent further issues.
                        </p>

                        <div className="bg-black/40 rounded-lg p-4 mb-8 text-left border border-white/5">
                            <code className="text-xs text-red-300 font-mono break-all">
                                {this.state.error?.toString()}
                            </code>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
