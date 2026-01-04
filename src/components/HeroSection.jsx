import React, { useState, useEffect } from "react";
import { dummyShowsData } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const movies = [
  {
    id: 1,
    title: "Guardians of the Galaxy",
    year: "2018",
    duration: "2h 8m",
    genres: "Action | Adventure | Sci-Fi",
    description:
      "In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.",
    bg: "/backgroundImage.png",
    logo: dummyShowsData.marvelLogo,
  },
  {
    id: 2,
    title: "Avengers: Endgame",
    year: "2019",
    duration: "3h 1m",
    genres: "Action | Drama | Sci-Fi",
    description:
      "The Avengers assemble once more to reverse the chaos caused by Thanos and restore balance to the universe.",
    bg: "/background.png",
    logo: dummyShowsData.marvelLogo,
  },
  {
    id: 3,
    title: "Moon Knight",
    year: "2022",
    duration: "6 Episodes",
    genres: "Action | Fantasy | Mystery",
    description:
      "Steven Grant and mercenary Marc Spector investigate the mysteries of the Egyptian gods from inside the same body, becoming the vigilante Moon Knight.",
    bg: "/bg.png",
    logo: dummyShowsData.marvelLogo,
  },
];

const HeroSection = () => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const movie = movies[current];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Dynamic Background Image with Smooth Fade */}
      <div
        key={movie.id}
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105"
        style={{ backgroundImage: `url(${movie.bg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end items-start pb-24 px-6 md:px-16 lg:px-36 w-full">

        {/* Cinematic Title */}
        <h1 className="text-5xl md:text-7xl lg:text-[90px] font-black leading-[0.9] text-white tracking-tighter mb-6 drop-shadow-2xl max-w-4xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-500">
            {movie.title}
          </span>
        </h1>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-200 mb-8">
          <span className="px-3 py-1 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">{movie.year}</span>
          <span className="px-3 py-1 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">{movie.duration}</span>
          <span className="text-pink-400 font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(244,114,182,0.4)]">{movie.genres}</span>
        </div>

        {/* Description */}
        <p className="max-w-xl text-gray-300 text-lg leading-relaxed mb-10 line-clamp-3 md:line-clamp-none drop-shadow-md">
          {movie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              navigate(`/movies/${movie.id}/${today}`);
            }}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              <Ticket className="w-5 h-5 fill-current" /> Book Now
            </span>
          </button>
          <button className="px-8 py-4 bg-white/10 border border-white/10 rounded-full text-white font-semibold backdrop-blur-md hover:bg-white/20 transition-all hover:border-white/30">
            Watch Trailer
          </button>
        </div>

      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-10 right-10 md:right-20 flex gap-3 z-20">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-500 rounded-full ${idx === current
              ? "w-8 h-2 bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
              : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
