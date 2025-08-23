import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
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
    logo: assets.marvelLogo,
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
    logo: assets.marvelLogo,
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
    logo: assets.marvelLogo,
  },
];

const HeroSection = () => {
  const navigate= useNavigate()
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const movie = movies[current];

  return (
    <div
      className="relative h-screen flex flex-col justify-center px-6 md:px-16 lg:px-36 text-white transition-all duration-700"
      style={{
        backgroundImage: `url(${movie.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col gap-4 max-w-2xl mt-20">
        <img src={movie.logo} alt="" className="max-h-11 lg:h-11 self-start" />

        <h1 className="text-5xl md:text-[70px] md:leading-[4.5rem] font-semibold">
          {movie.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-300">
          <span>{movie.genres}</span>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4.5 h-4.5" /> {movie.year}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4.5 h-4.5" /> {movie.duration}
          </div>
        </div>

        <p className="max-w-md text-gray-300">{movie.description}</p>

        <button onClick={()=> navigate('/movies')} className="flex items-center gap-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 transition rounded-full font-medium cursor-pointer w-fit">
          Explore Movies
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? "bg-red-600 scale-110" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
