import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../assets/lib/timeFormat'
import CastAvatar from './CastAvatar'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  return (
    <div
      className="group relative flex flex-col bg-gray-900 rounded-2xl shadow-lg overflow-hidden 
                 hover:shadow-xl hover:-translate-y-2 transition duration-300 w-64 cursor-pointer"
      onClick={() => { navigate(`/movies/${movie._id}`); window.scrollTo(0, 0) }}
    >
      {/* Movie Poster */}
      <div className="relative">
        <img
          src={movie.poster_path || movie.backdrop_path || "/placeholder.jpg"}
          alt={movie.title}
          className="h-72 w-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full text-xs text-gray-100">
          <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>
            {/* Safely handle rating: if it's a number, fix to 1 decimal. If string (N/A), show as is. */}
            {!isNaN(Number(movie.vote_average)) ? Number(movie.vote_average).toFixed(1) : movie.vote_average || "N/A"}
          </span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-lg truncate">{movie.title}</h3>

        <p className="text-sm text-gray-400 mt-1">
          {movie.release_date && (movie.release_date.split("-")[0] || movie.release_date)} •{" "}
          {/* Handle genres: OMDb doesn't give genres in list, so just ignore or show if available */}
          {movie.genres ? movie.genres.slice(0, 2).map(g => g.name).join(" | ") : "Movie"}
        </p>

        {/* Runtime */}
        {movie.runtime && (
          <p className="text-xs text-gray-500 mt-1">{movie.runtime} min</p>
        )}

        {/* Cast - Added based on request */}
        {movie.actors && movie.actors.length > 0 && (
          <div className="mt-3 flex items-center">
            {movie.actors.slice(0, 4).map((actor, i) => (
              <div
                key={i}
                className={`relative w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden ${i > 0 ? '-ml-3' : ''} bg-gray-800`}
                style={{ zIndex: 10 - i }}
                title={actor}
              >
                <CastAvatar
                  name={actor}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Buy Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent parent onClick
            navigate(`/movies/${movie._id}`);
            window.scrollTo(0, 0)
          }}
          className="mt-4 px-4 py-2 text-sm bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition rounded-full font-medium text-white shadow-md hover:shadow-lg"
        >
          🎟 Buy Tickets
        </button>
      </div>
    </div>
  )
}

export default MovieCard
