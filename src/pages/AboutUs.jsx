import React from 'react';
import { assets } from '../assets/assets';
import SEO from '../components/SEO';
import { Users, Target, Heart, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 relative overflow-hidden">
            <SEO title="About Us - QuickShow" description="Learn about QuickShow's mission to revolutionize the movie booking experience." />

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
            <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

                {/* Hero */}
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-500">
                        Reimagining Cinema.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                        QuickShow isn't just a booking platform. It's your gateway to the multiverse of entertainment, built for movie lovers by movie lovers.
                    </p>
                </div>

                {/* Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <FeatureCard
                        icon={<Target className="text-pink-500 w-8 h-8" />}
                        title="Our Mission"
                        desc="To eliminate the friction between you and the big screen. No queues, no hassle, just pure movie magic."
                    />
                    <FeatureCard
                        icon={<Sparkles className="text-purple-500 w-8 h-8" />}
                        title="The Experience"
                        desc="We blend cutting-edge technology with premium aesthetics to make booking tickets as exciting as the movie itself."
                    />
                    <FeatureCard
                        icon={<Heart className="text-red-500 w-8 h-8" />}
                        title="Community"
                        desc="Join millions of cinephiles who trust QuickShow for their weekly dose of entertainment and popcorn."
                    />
                </div>

                {/* Story Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
                    <div className="lg:w-1/2 perspective-1000">
                        <TiltCard />
                    </div>
                    <div className="lg:w-1/2 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">The Story So Far</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Founded in 2024, QuickShow started with a simple idea: why does booking a movie ticket feel like a chore?
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            We gathered a team of designers, engineers, and die-hard cinema fans to rebuild the experience from the ground up.
                            Today, we serve thousands of theaters across the globe, bringing the magic of movies closer to you.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Add these imports at the top:
// import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 group">
        <div className="mb-6 p-4 rounded-2xl bg-black/50 w-fit group-hover:scale-110 transition-transform duration-300 border border-white/5">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

const TiltCard = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative w-full aspect-video rounded-2xl cursor-pointer group perspective-1000"
        >
            <div
                style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
                className="absolute inset-4 rounded-xl bg-black/40 shadow-2xl border border-white/10 z-10 pointer-events-none"
            />
            <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-75 transition duration-500"
            />
            <motion.img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
                alt="Cinema 3D"
                style={{ transform: "translateZ(20px)" }}
                className="w-full h-full object-cover rounded-2xl shadow-xl bg-black/50"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent pointer-events-none" style={{ transform: "translateZ(30px)" }} />

            {/* Floating Badge */}
            <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg" style={{ transform: "translateZ(60px)" }}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-bold text-white text-sm">Live Experience</span>
            </div>
        </motion.div>
    );
};

export default AboutUs;
