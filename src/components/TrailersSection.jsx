import React, { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import { Play, PlayCircleIcon, X } from 'lucide-react';

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const TrailersSection = () => {
  const hasTrailers = Array.isArray(dummyTrailers) && dummyTrailers.length > 0;

  // State for the modal player
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  if (!hasTrailers) return null;

  return (
    <div className="relative w-full py-20 overflow-hidden bg-black selection:bg-pink-500 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 px-6 md:px-16 lg:px-36">

        {/* Header - Consistent with FeaturedSection */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-gradient-to-b from-pink-600 to-purple-600 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">Latest Trailers</h2>
              <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mt-1">Direct from Theaters</p>
            </div>
          </div>
        </div>

        {/* Trailers Grid - Increased Gaps & sleek cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dummyTrailers.map((trailer, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTrailer(trailer)}
              className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-white/5 hover:border-pink-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:-translate-y-2"
            >
              {/* Thumbnail Image */}
              <img
                src={trailer.image}
                alt={trailer.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-pink-600 group-hover:border-pink-500 transition-all duration-300 shadow-2xl">
                  <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow-md group-hover:text-pink-100 transition-colors">{trailer.title}</h3>
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Watch Now</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-pink-500/50 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {selectedTrailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-xl animate-fade-in">
          {/* Close Overlay */}
          <div className="absolute inset-0" onClick={() => setSelectedTrailer(null)} />

          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.2)] border border-white/10 ring-1 ring-white/10">
            <button
              onClick={() => setSelectedTrailer(null)}
              className="absolute top-6 right-6 z-20 p-2 bg-black/50 hover:bg-pink-600 rounded-full text-white transition-all border border-white/10 backdrop-blur-md group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(selectedTrailer.videoUrl)}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedTrailer.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailersSection;
